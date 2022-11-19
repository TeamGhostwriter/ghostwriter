import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import logo from "./logo.svg";

let bufferSize = 2048,
  context,
  processor,
  input,
  globalStream;

async function getAnswer(question) {
  fetch("https://api.datamuse.com/words?rel_rhy=" + question)
    .then((response) => response.json())
    .then((data) =>
      data.slice(0, 5).map((word) => {
        console.log(word.word);
      })
    );
}

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

function App() {
  const socket = useRef(null);
  const [transcript, setTranscript] = useState("");
  const firstWord = transcript.split(" ")[0];
  const [newTranscript, setNewTranscript] = useState("");
  const [totalTranscript, setTotalTranscript] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    setupSocket();
  }, []);

  useEffect(() => {
    if (firstWord !== newTranscript.split(" ")[0]) {
      console.log("new", newTranscript);
      setTranscript(newTranscript);
    } else {
      if (newTranscript.split(" ").length >= transcript.split(" ").length) {
        console.log("same", newTranscript);
        setTranscript(newTranscript);
      } else {
        console.log("nothing happened");
      }
    }
  }, [newTranscript]);

  const setupSocket = () => {
    socket.current = io("http://localhost:3001", {
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
      console.log("data received" + data);
      setNewTranscript(data);
    });
  };

  const setup = async () => {
    context = new (window.AudioContext || window.webkitAudioContext)({
      // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
      latencyHint: "interactive",
    });
    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.connect(context.destination);
    context.resume();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    globalStream = stream;
    input = context.createMediaStreamSource(stream);
    input.connect(processor);

    processor.onaudioprocess = (e) => {
      microphoneProcess(e);
    };
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
    <div className="App">
      <div>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <h1>Ghostwriter Demo</h1>
      <div>
        <button onClick={isStreaming ? stop : start}>
          {isStreaming ? "pause" : "record"}
        </button>
      </div>
      <div>
        <p>{transcript}</p>
      </div>
    </div>
  );
}

export default App;
