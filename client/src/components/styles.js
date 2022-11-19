import styled from "@emotion/styled";

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
      fontSize: "2.25em",
      marginBottom: "0.8888889em",
      lineHeight: "1.1111111rem",
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
          primary: "rgb(166, 182, 216)",
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
  max-width: 832px;
  flex-wrap: wrap;
  text-align: center;
`;
