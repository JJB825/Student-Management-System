import React from "react";
import Header from "../components/Header";
import StudentTable from "../components/StudentTable";
import "../App.css";

const Home = () => {
  return (
    <>
      <Header />
      <main id="site-main">
        <div className="container">
          <div className="box-nav d-flex justify-between">
            <a href="/add-student" className="border-shadow">
              <span className="text-gradient">Add Student</span>
            </a>
          </div>
          <StudentTable />
        </div>
      </main>
    </>
  );
};

export default Home;
