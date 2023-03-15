import "./App.scss";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import MenuIndex from "./pages/Menu/MenuIndex";
import MenuContent from "./pages/Menu/MenuContent/MenuContent";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route path="menu" element={<MenuIndex />}>
            <Route path="first/:" element={<MenuContent />} />
            <Route path="second" element={<MenuContent />} />
            <Route path="third" element={<MenuContent />} />
            <Route path="fouth" element={<MenuContent />} />
            <Route path="/menu" element={<Navigate to="/menu/first" />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
