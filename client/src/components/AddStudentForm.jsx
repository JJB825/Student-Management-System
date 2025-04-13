import React from "react";
import "../App.css";
import axios from "axios";
import { useStudentContext } from "../hooks/useStudentContext";
import { actions } from "../utils/actions";
import { showErrorToast, showSuccessToast } from "../utils/notifications.js";

const AddStudentForm = () => {
  const { dispatch } = useStudentContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if ([...formData.values()].includes("")) {
      showErrorToast("Please fill all the values!");
      form.reset();
      return;
    }

    const formObject = Object.fromEntries(formData);
    const mobileRegex = /^(\+91|91|0)?[- ]?(\d{10})$/;
    if (!mobileRegex.test(formObject.mobile)) {
      showErrorToast("Please enter a valid mobile number");
      form.reset();
      return;
    }

    try {
      const response = await axios.post("/api/student/add", formObject);
      dispatch({ type: actions.CREATE_STUDENT, payload: formObject });
      showSuccessToast(response.data.message);
    } catch (error) {
      showErrorToast("Some error occurred while adding new user");
      console.error(error);
    }

    form.reset();
  };

  return (
    <form id="add_user" onSubmit={handleSubmit}>
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
          <input type="text" name="course" placeholder="Software Engineering" />
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
  );
};

export default AddStudentForm;
