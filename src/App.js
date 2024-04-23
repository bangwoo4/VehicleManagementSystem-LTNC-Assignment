import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Project from "./ProjectManagement";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/quan-li-doi-xe" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
