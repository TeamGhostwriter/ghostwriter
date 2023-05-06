import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { Typography, Button } from "@mui/material";
import Suggestions from "./suggestions";
import { RecordButton } from "./styles";
import useSound from "use-sound";
import beat1 from "../assets/beats/1.mp3";
import beat2 from "../assets/beats/2.mp3";
import beat3 from "../assets/beats/3.mp3";
import beat4 from "../assets/beats/4.mp3";
import beat5 from "../assets/beats/5.mp3";
import beat6 from "../assets/beats/6.mp3";
import beat7 from "../assets/beats/7.mp3";
import beat8 from "../assets/beats/8.mp3";

let bufferSize = 2048,
  context,
  processor,
  input,
  globalStream;

const beats = [beat1, beat2, beat3, beat4, beat5, beat6, beat7, beat8];
let rhymeSuggestions = {};

const downsampleBuffer = (buffer, sampleRate, outSampleRate) => {
  if (outSampleRate === sampleRate) {
    return buffer;
  }
  if (outSampleRate > sampleRate) {
    throw new Error(
      "downsampling rate show be smaller than original sample rate"
    );
  }
  var sampleRateRatio = sampleRate / outSampleRate;
  var newLength = Math.round(buffer.length / sampleRateRatio);
  var result = new Int16Array(newLength);
  var offsetResult = 0;
  var offsetBuffer = 0;
  while (offsetResult < result.length) {
    var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    var accum = 0,
      count = 0;
    for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }

    result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result.buffer;
};

const sendAudioFile = async (file, lyrics) => {
  const formData = new URLSearchParams({ recording: file, lyrics: lyrics });
  return fetch("https://prod-ghostwriter.herokuapp.com/api/recordings", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
};

function Project() {
  const socket = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [newTranscript, setNewTranscript] = useState("");
  const [totalTranscript, setTotalTranscript] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [maxChars, setMaxChars] = useState(0);
  const [blobUrl, setBlobUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [curBeat, setCurBeat] = useState(beat1);
  const [play, { stop: stopBeat }] = useSound(curBeat);
  const [transcripts, setTranscripts] = useState(null);
  const [rhymes, setRhymes] = useState(null);

  useEffect(() => {
    setupSocket();
  }, []);

  useEffect(() => {
    const allWordsOld = transcript.trim().split(" ");
    const allWordsNew = newTranscript.trim().split(" ");
    const firstWordOld = allWordsOld[0];
    const firstWordNew = allWordsNew[0];

    // console.log("allWordsOld", allWordsOld);
    // console.log("firstWordOld", firstWordOld);
    // console.log("allWordsNew", allWordsNew);
    // console.log("firstWordNew", firstWordNew);

    // console.log(firstWordOld === firstWordNew);
    if (firstWordOld === "" || firstWordNew === "") {
      // console.log("case 1" + newTranscript);
      console.log("I'M HERE");
      setTranscript(newTranscript);
      return;
    }

    if (firstWordOld !== firstWordNew) {
      // console.log("case 2" + newTranscript);
      console.log(newTranscript);
      if (allWordsOld.length > 3) {
        setTotalTranscript([...totalTranscript, transcript]);
      }
      setTranscript(newTranscript);
      setMaxChars(1);
    } else {
      if (
        allWordsNew.length >= allWordsOld.length &&
        allWordsNew.length >= maxChars
      ) {
        setMaxChars(allWordsNew.length);
        // console.log("case 3 old" + allWordsOld);
        // console.log("case 3 new" + allWordsNew);

        console.log(newTranscript);
        setTranscript(newTranscript);
      }
    }
  }, [newTranscript]);

  useEffect(() => {
    async function getRhymes(lastWord) {
      // const lastWord = transcript.split(" ").at(-1);
      // //if the transcript has ever read in the current word
      // console.log(rhymeSuggestions);
      // console.log('im straight', transcript.split(" ").slice(0, -1), lastWord);

      //totalTranscript but as an array but i want to remove the element
      if (totalTranscript.slice(0, -1).includes(lastWord)) {
        rhymeSuggestions[lastWord] += 5;
      } else {
        rhymeSuggestions[lastWord] = 0;
      }
      await fetch("https://api.datamuse.com/words?rel_rhy=" + lastWord)
        .then((response) => response.json())
        .then((data) =>
          setRhymes(
            data.slice(
              rhymeSuggestions[lastWord],
              rhymeSuggestions[lastWord] + 5
            )
          )
        );
    }

    getRhymes(transcript.split(" ").at(-1));
  }, [transcript]);

  const fetchRecordings = async () => {
    const response = await fetch(
      "https://prod-ghostwriter.herokuapp.com/api/get/recordings"
    );
    const data = await response.json();
    setTranscripts(data);
    console.log(data);
  };

  const setupSocket = () => {
    socket.current = io("https://prod-ghostwriter.herokuapp.com/", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log("connected");
    });

    socket.current.on("data", (data) => {
      // console.log("data received" + data);
      setNewTranscript(data);
    });
  };

  const setup = async () => {
    setTranscript("");
    setNewTranscript("");
    setTotalTranscript([]);
    setUploaded(false);
    setBlobUrl(null);
    setBlob(null);

    context = new (window.AudioContext || window.webkitAudioContext)({
      // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
      latencyHint: "interactive",
    });
    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.connect(context.destination);
    context.resume();

    play();
    const stream = await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Collection for recorded data.
        let data = [];

        // Recorder instance using the stream.
        // Also set the stream as the src for the audio element.
        const recorder = new MediaRecorder(stream);

        recorder.addEventListener("start", (e) => {
          // Empty the collection when starting recording.
          data.length = 0;
        });

        recorder.addEventListener("dataavailable", (event) => {
          // Push recorded data to collection.
          data.push(event.data);
        });

        // Create a Blob when recording has stopped.
        recorder.addEventListener("stop", () => {
          const blob = new Blob(data, {
            type: "audio/mp3",
          });
          setBlob(blob);
          setBlobUrl(URL.createObjectURL(blob));
        });

        // Start the recording.
        recorder.start();
        globalStream = stream;
        input = context.createMediaStreamSource(stream);
        input.connect(processor);

        processor.onaudioprocess = (e) => {
          microphoneProcess(e);
        };
      });
  };

  const microphoneProcess = (e) => {
    var left = e.inputBuffer.getChannelData(0);
    var left16 = downsampleBuffer(left, 44100, 16000);
    socket.current.emit("stream", left16);
  };

  const start = () => {
    setup();
    setIsStreaming(true);
  };

  const stop = () => {
    if (isStreaming) {
      stopBeat();
      setCurBeat(beats[Math.floor(Math.random() * beats.length)]);
      // stop record track from browser
      let track = globalStream.getTracks()[0];
      track.stop();

      // stop recorder from browser
      input.disconnect(processor);
      processor.disconnect(context.destination);
      context.close().then(() => {
        input = null;
        processor = null;
        context = null;
        socket.current.emit("stop");
      });

      setIsStreaming(false);
    }
  };

  return (
    <div>
      <Typography variant="title">Ghostwriter</Typography>
      <div style={{ marginTop: "1rem" }}>
        <Typography variant="subtitle">
          Your personalized AI freestyle assistant.
        </Typography>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <RecordButton onClick={isStreaming ? stop : start}>
          {isStreaming ? "stop" : "play beat & record"}
        </RecordButton>
      </div>
      <div>
        {totalTranscript.map((singleTranscript, index) => (
          <p key={index}>{singleTranscript}</p>
        ))}
        <h1>{transcript}</h1>

        <h3
          style={{
            underline: "1",
          }}
        >
          Rhymes
        </h3>
        <div
        // style={{
        //   display: "flex",
        //   flexDirection: "column",
        //   flexWrap: "wrap",
        //   justifyContent: "space-around",
        //   alignItems: "center",
        // }}
        >
          {rhymes &&
            rhymes.map((rhyme) => {
              return <p>{rhyme.word}</p>;
            })}
        </div>
        {/* <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: "auto",
            marginRight: "auto",
            width: 400,
            maxWidth: "100%",
            overflow: "cover",
            justifyContent: "center",
          }}
        >
          {transcript.split(" ").map((word) => (
            <div style={{ marginRight: "1rem" }}>
              <Suggestions word={word} />
            </div>
          ))}
        </div> */}
      </div>
      {blob && blobUrl ? (
        <div>
          <div style={{ marginTop: "2rem" }}>
            <audio src={blobUrl} controls />
          </div>
          <Button
            onClick={() => {
              sendAudioFile(blob, totalTranscript + transcript);
              setUploaded(true);
            }}
          >
            {uploaded ? "✔️" : "upload"}
          </Button>
        </div>
      ) : null}

      <Button
        style={{ marginTop: "1.5rem", marginBottom: "2rem" }}
        onClick={fetchRecordings}
      >
        See Other Freestyles
      </Button>
      {transcripts ? (
        <div>
          {transcripts.map((transcript, index) => (
            <div
              style={{
                border: 2,
                padding: 5,
                borderColor: "#FFFFFF",
                borderStyle: "double",
                marginTop: 10,
              }}
            >
              <p key={index}>{transcript.lyrics}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Project;
