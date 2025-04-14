import React from "react";
import "../App.css";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useStudentContext } from "../hooks/useStudentContext";
import axios from "axios";
import { actions } from "../utils/actions";
import { showSuccessToast, showErrorToast } from "../utils/notifications.js";

const UpdateUserPage = () => {
  const { studentId } = useParams();
  const { dispatch } = useStudentContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const hasAnyValue = [...formData.values()].some(
      (value) => value.trim() !== ""
    );
    if (!hasAnyValue) {
      showErrorToast("Please enter some values!");
      form.reset();
      return;
    }

    const formObject = Object.fromEntries(formData);
    const mobileRegex = /^(\+91|91|0)?[- ]?(\d{10})$/;
    if (
      formObject.mobile.trim() !== "" &&
      !mobileRegex.test(formObject.mobile)
    ) {
      showErrorToast("Please enter a valid mobile number");
      form.reset();
      return;
    }

    try {
      const response = await axios.patch(
        `/api/student/update/${studentId}`,
        formObject
      );
      const result = await axios.get("/api/student/view");
      dispatch({
        type: actions.UPDATE_STUDENT,
        payload: result.data.data,
      });
      showSuccessToast(response.data.message);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ??
          "Some error occurred while adding new user"
      );
    }

    form.reset();
  };

  return (
    <>
      <Header />
      <main id="site-main">
        <div className="container">
          <div className="box-nav d-flex justify-between">
            <div className="filter">
              <a href="/" className="border-shadow">
                <span className="text-gradient">All Students</span>
              </a>
            </div>
          </div>
          <div className="form-title text-center">
            <h2 className="text-dark">Update Student</h2>
            <span className="text-dark">
              Use the below form to update student details
            </span>
          </div>

          <form id="update_user" onSubmit={handleSubmit}>
            <div className="new_user">
              <div className="form-group">
                <label htmlFor="stname" className="text-dark">
                  Name
                </label>
                <input type="text" name="stname" placeholder="Mark Stoenis" />
              </div>
              <div className="form-group">
                <label htmlFor="course" className="text-dark">
                  Course
                </label>
                <input
                  type="text"
                  name="course"
                  placeholder="Software Engineering"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fee" className="text-dark">
                  Fees
                </label>
                <input type="number" name="fee" placeholder="Enter Fees" />
              </div>
              <div className="form-group">
                <label htmlFor="mobile" className="text-dark">
                  Mobile
                </label>
                <input type="text" name="mobile" placeholder="+919876543210" />
              </div>
              <div className="form-group">
                <button type="submit" className="btn text-dark update">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default UpdateUserPage;
