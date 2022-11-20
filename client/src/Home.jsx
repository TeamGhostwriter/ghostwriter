import React, {useMemo, useState} from "react";
import { AppWrapper, getDesignTokens } from "./components/styles";
import Home from "./components/Project";
import {createTheme, CssBaseline, ThemeProvider, useMediaQuery} from "@mui/material";
import Header from "./components/header";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Project from "./components/Project";
import App from './App'

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {
  },
});

function HomePage() {
  const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");
  const [mode, setMode] = useState(
    prefersLightMode ? "light" : "dark"
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );
  console.log('mode', mode);
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        {/* <Button onClick={() => console.log("social button clicked")}> */}
        {/* <Link to="/social">Social</Link> */}
      {/* </Button> */}
        <AppWrapper style={{backgroundColor: theme.palette.background.default}}>
          {/* <Project /> */}
          {/* <Test /> */}
          <App />
        </AppWrapper>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default HomePage;
