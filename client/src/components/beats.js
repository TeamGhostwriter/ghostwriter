import {useContext} from "react";
import {ColorModeContext} from "../App";
import {useTheme} from "@mui/material";
import {BeatsWrapper} from "./styles";
import ReactAudioPlayer from "react-audio-player";

function Beats() {
  const theme = useTheme();

  return (
    <BeatsWrapper style={{backgroundColor: theme.palette.background.default}}>
      <ReactAudioPlayer
        src="../assets/2.mp3"
        autoPlay
        controls
      />
    </BeatsWrapper>
  );
}

export default Beats;
