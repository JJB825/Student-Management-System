import React from "react";
import "../App.css";
import { useStudentContext } from "../hooks/useStudentContext";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { actions } from "../utils/actions";
import { showSuccessToast, showErrorToast } from "../utils/notifications.js";

const StudentTable = () => {
  const { students, dispatch } = useStudentContext();
  useFetch();
  const navigate = useNavigate();

  const deleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`/api/student/delete/${studentId}`);
      dispatch({ type: actions.DELETE_STUDENT, payload: studentId });
      showSuccessToast(response.data.message);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ??
          "Some error occurred while deleting a student"
      );
    }
  };

  return (
    <form>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Fees</th>
            <th>Mobile Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const { id, stname, course, fee, mobile } = student;
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{stname}</td>
                <td>{course}</td>
                <td>{fee}</td>
                <td>{mobile}</td>
                <td>
                  <a
                    onClick={() => navigate(`/update-student/${id}`)}
                    className="btn border-shadow update"
                  >
                    <span className="text-gradient">Update</span>
                  </a>
                  <a
                    onClick={() => deleteStudent(id)}
                    className="btn border-shadow delete"
                  >
                    <span className="text-gradient">Delete</span>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </form>
  );
};

export default StudentTable;
