import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../App";
import {IconButton, useTheme, Typography} from "@mui/material";
import {useContext} from "react";
import {HeaderWrapper} from "./styles";
import React, { useRef, useEffect, useState } from "react";
import { RecordButton } from "./styles";

function SuggestionHome({ isStream, stop, start, totalTranscript, transcript }) {
  const theme = useTheme();
  const [isStreaming, setIsStreaming] = useState(isStream);

  return (
    <div>
        <Typography variant="title">Ghostwriter</Typography>
        <div style={{marginTop: '1rem'}}>
            <Typography variant="subtitle">Rapping is a form of poetry, one to ease the mind and provide clarity. We are hacking the mental health space by giving literal poetic justice to users around the world.</Typography>
        </div>
        <div style={{marginTop: '2rem'}}>
            <RecordButton onClick={isStreaming ? stop : start}>
                {isStreaming ? "pause" : "record"}
            </RecordButton>
            {isStreaming ? <SuggestionHome /> : null}
        </div>
        <div>
            {totalTranscript.map((singleTranscript, index) => (
                <p key={index}>{singleTranscript}</p>
            ))}
            <h1>{transcript}</h1>
        </div>
    </div>
  );
}

export default SuggestionHome;
