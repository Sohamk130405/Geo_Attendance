import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Attendance from "./components/Attendance";
import CreateSession from "./components/CreateSession";
import ViewAttendance from "./components/ViewAttendance"; // Import the new component
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ViewSessions from "./components/ViewSessions";
import ViewAllStudents from "./components/ViewAllStudents";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("facultyId")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/create-session" element={<CreateSession />} />
          <Route path="/students" element={<ViewAllStudents />} />
          <Route
            path="/view-attendance/:sessionId"
            element={<ViewAttendance isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/view-sessions"
            element={
              <ViewSessions facultyId={localStorage.getItem("facultyId")} />
            }
          />
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
};

export default App;
