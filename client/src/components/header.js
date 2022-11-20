import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../Home.jsx";
import {IconButton, useTheme, Link, Button, Stack} from "@mui/material";
import {useContext} from "react";
import { HeaderWrapper } from "./styles";
import { AppBar, Toolbar } from "@mui/material";
// import { Link } from "react-router-dom";
// import Link from '@mui/material/Link';




function Header() {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  return (
    <header>
      <AppBar>
      <Toolbar>
      <IconButton sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon/>
        ) : (
          <Brightness4Icon/>
        )}
      </IconButton>
          <Stack>
          <Link href="/" >HomePage</Link>
          <Link href="/SocialPage" >SocialPage</Link>
        </Stack>
       </Toolbar>
      </AppBar>
        </ header>
  );
}

export default Header;
