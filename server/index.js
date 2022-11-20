const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { Sequelize } = require("sequelize-cockroachdb");
const bodyParser = require("body-parser");
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

// Configure Transcription Request
const request = {
  config: {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US",
  },
  interimResults: true,
};

let recognizeStream = null;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));

const sequelize = new Sequelize(process.env.DATABASE_URL);

const Recording = sequelize.define("transcripts", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recording: {
    type: Sequelize.BLOB,
    allowNull: false,
  },
  lyrics: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

app.get("/api/get/recordings", async (req, res) => {
  const recordings = await Recording.findAll();
  res.send(recordings);
});

app.post("/api/recordings", async (req, res) => {
  try {
    await sequelize.sync();
    console.log(req.body);
    const recording = await Recording.create({
      recording: req.body.recording,
      lyrics: req.body.lyrics,
    });
    res.send(recording);
  } catch (err) {
    console.log(err);
  }
});
server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

io.on("connection", (socket) => {
  console.log("new client connected");

  socket.on("stream", (data) => {
    if (!recognizeStream) {
      console.log("INIT GOOGLE CLOUD SPEECH");
      // Create Stream to the Google Speech to Text API
      recognizeStream = client
        .streamingRecognize(request)
        .on("error", console.error)
        .on("data", (data) => {
          console.log(data.results[0].alternatives[0].transcript);
          socket.emit("data", data.results[0].alternatives[0].transcript);
        });
    }

    recognizeStream.write(data);
  });

  socket.on("stop", () => {
    console.log("STOP STREAMING");
    recognizeStream.destroy();
    recognizeStream = null;
  });
});
