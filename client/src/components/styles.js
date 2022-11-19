import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const getDesignTokens = (mode) => ({
  typography: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    body: {
      fontSize: "1rem",
      lineHeight: 1.25,
      marginTop: "1.25em",
      marginBottom: "1.25em",
    },
    title: {
      fontWeight: 800,
      fontSize: "6.25em",
      lineHeight: "6.5rem",
    },
    subtitle: {
      fontWeight: 400,
      fontSize: "1.25em",
      lineHeight: "2.5rem",
    },
  },
  palette: {
    mode,
    ...(mode === "light"
      ? {
        // palette values for light mode
        text: {
          primary: "#111827",
          secondary: "#374151",
          tertiary: "rgb(107 114 128)",
        },
        background: {
          default: "#fff",
        },
        divider: "rgb(229 231 235)",
      }
      : {
        // palette values for dark mode
        text: {
          primary: "#FAFAFA",
          secondary: "rgb(179, 188, 203)",
          tertiary: "rgb(107 114 128)",
        },
        background: {
          default: "#1f1f1f",
        },
        divider: "rgb(48, 48, 48)",
      }),
  },
});

export const AppWrapper = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 12rem;
  max-width: 832px;
  flex-wrap: wrap;
  text-align: center;
`;

export const HeaderWrapper = styled.div`
  position: fixed;
  margin-top: 1.5rem;
  margin-right: 2rem;
  right: 0;
  top: 0;
  z-index: 50;
`

export const RecordButton = styled(Button)({
  width: '300px',
  height: '75px',
  backgroundImage: 'linear-gradient(315deg, #0063cc 0%, #19a5fe 74%)',
  color: 'black',
})


