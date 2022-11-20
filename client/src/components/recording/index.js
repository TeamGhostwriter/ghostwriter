import { RecordingWrapper } from "../styles";
import Suggestions from "./suggestions";
import { Typography } from "@mui/material";

function Recording({transcript}) {

  return (
    <RecordingWrapper>
      {transcript.split(" ").map(word => {
        return <div style={{marginRight: '1rem'}}>
          <Typography variant="header1">{word}</Typography>
          <Suggestions word={word} />
        </div>
      })}
    </RecordingWrapper>
  );
}

export default Recording;
