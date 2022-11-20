// importing components from react-router-dom package
import { accordionActionsClasses } from "@mui/material";
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import * as ReactDOM from "react-dom";
import Home from "./Home.jsx";
import SocialPage from "./SocialPage";
import Project from "./components/Project.js";

const App = () => {
  return (
      <div className="app">
        <Routes> 
          <Route path="/" element={<Project/>}/>
          <Route path="/SocialPage" element={<SocialPage/>}/>
        </Routes>
      </div>
  );
};

// ReactDOM.render(<App />, document.getElementById("root"));
export default App;
