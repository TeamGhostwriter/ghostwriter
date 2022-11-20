import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { Typography } from "@mui/material";
import { RecordButton } from "../components/styles";
import Header from "../components/header";
// import Home from "./Home.jsx";

function SocialPage() {
  
 console.log("SocialPage");
  return (
    <div>
      <Header />
      {/* <Typography variant="title">Social Page</Typography>
      <div style={{marginTop: '1rem'}}>
        <Typography variant="subtitle">For when you want intspiration.</Typography>
      </div> */}
    </div>
  );
}

export default SocialPage;