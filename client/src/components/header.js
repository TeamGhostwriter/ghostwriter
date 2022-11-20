import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../App";
import {IconButton, useTheme} from "@mui/material";
import {useContext} from "react";
import {HeaderWrapper} from "./styles";

function Header() {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  return (
    <HeaderWrapper style={{backgroundColor: theme.palette.background.default}}>
      <IconButton
        sx={{ml: 1}}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon/>
        ) : (
          <Brightness4Icon/>
        )}
      </IconButton>
    </HeaderWrapper>
  );
}

export default Header;
