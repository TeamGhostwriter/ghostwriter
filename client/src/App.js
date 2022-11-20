import React, {useMemo, useState} from "react";
import { AppWrapper, getDesignTokens } from "./components/styles";
import Home from "./components/home";
import {createTheme, CssBaseline, ThemeProvider, useMediaQuery} from "@mui/material";
import Header from "./components/header";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {
  },
});

function App() {
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
        <AppWrapper style={{backgroundColor: theme.palette.background.default}}>
          <Home />
        </AppWrapper>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
