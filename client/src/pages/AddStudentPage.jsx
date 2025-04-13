import React from "react";
import Header from "../components/Header";
import AddStudentForm from "../components/AddStudentForm";
import "../App.css";

const AddStudentPage = () => {
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
            <h2 className="text-dark">New Student</h2>
            <span className="text-dark">
              Use the below form to add new student
            </span>
          </div>
          <AddStudentForm />
        </div>
      </main>
    </>
  );
};

export default AddStudentPage;
