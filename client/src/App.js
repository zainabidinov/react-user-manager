import { Routes, Route, Navigate } from "react-router-dom";
import Users from "./pages/Users"
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/users" element={<Users/>}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logIn" element={<LogIn />} />
      </Routes>
  );
}

export default App;
