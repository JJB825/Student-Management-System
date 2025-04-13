import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddStudentPage from "./pages/AddStudentPage";
import UpdateStudentPage from "./pages/UpdateUserPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route
          path="/update-student/:studentId"
          element={<UpdateStudentPage />}
        />
      </Routes>
    </>
  );
}

export default App;
