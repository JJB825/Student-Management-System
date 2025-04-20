const db = require("../db/connect.js");

// @description Add new student details
// @route POST api/student/add
// @access PUBLIC
const addStudentDetails = (req, res) => {
  const { stname, course, fee, mobile } = req.body;

  if ([stname, course, fee, mobile].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all input fields" });
  }

  if (isNaN(fee)) {
    return res
      .status(404)
      .json({ success: false, message: "Fee must be a valid number" });
  }

  const mobileRegex = /^(\+91|91|0)?[- ]?(\d{10})$/;
  if (!mobileRegex.test(mobile)) {
    return res
      .status(404)
      .json({ success: false, message: "Entered mobile number is not valid" });
  }

  const duplicateEntryCheckQuery = "SELECT * FROM student WHERE stname = ?";
  db.query(duplicateEntryCheckQuery, [stname], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Some error occurred while checking duplicates",
      });
    }

    const newStudent = { stname, course, fee: parseInt(fee), mobile };
    let existingStudent = rows[0];
    if (existingStudent) {
      delete existingStudent.id;
      if (JSON.stringify(existingStudent) === JSON.stringify(newStudent)) {
        return res.status(404).json({
          success: false,
          message: "Student exists with same details",
        });
      }
    }

    const values = [stname, course, fee, mobile];
    const sqlQuery =
      "INSERT INTO student (stname, course, fee, mobile) VALUES (?,?,?,?)";
    db.query(sqlQuery, values, (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Some error occurred while adding new student",
        });
      }

      return res
        .status(201)
        .json({ success: true, message: "New Student added successfully" });
    });
  });
};

// @description View student details
// @route GET api/student/view
// @access PUBLIC
const getStudentDetails = (req, res) => {
  const sqlQuery = "SELECT * FROM student";

  db.query(sqlQuery, (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Some error occurred while fetching details",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student details fetched successfully",
      data: rows,
    });
  });
};

// @description Search Student Details
// @route GET api/student/:studentId
// @access PUBLIC
const getSpecificStudentDetails = (req, res) => {
  const { studentId } = req.params;

  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Student ID" });
  }

  const sqlQuery = "SELECT * FROM student WHERE id = ?";
  db.query(sqlQuery, [studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `Some error occurred while fetching student with id ${studentId} details`,
      });
    }

    if (!rows || !rows.length) {
      return res.status(404).json({
        success: false,
        message: `Student with id ${studentId} not found`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Student details fetched successfully",
      data: rows[0],
    });
  });
};

// @description Update the student details
// @route PATCH api/student/update/:studentId
// @access PUBLIC
const updateStudentDetails = (req, res) => {
  const { studentId } = req.params;
  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Student ID" });
  }

  const { stname, course, fee, mobile } = req.body;

  if ([stname, course, fee, mobile].every((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill the input fields" });
  }

  if (fee !== undefined && fee?.trim() !== "" && isNaN(fee)) {
    return res
      .status(404)
      .json({ success: false, message: "Fee must be a valid number" });
  }

  const mobileRegex = /^(\+91|91|0)?[- ]?(\d{10})$/;
  if (
    mobile !== undefined &&
    mobile?.trim() !== "" &&
    !mobileRegex.test(mobile)
  ) {
    return res
      .status(404)
      .json({ success: false, message: "Entered mobile number is not valid" });
  }

  let sqlQuery = "UPDATE student SET ";
  const nonEmptyFields = [];
  const updates = [];
  const fieldVals = new Map([
    ["stname", stname],
    ["course", course],
    ["fee", fee],
    ["mobile", mobile],
  ]);

  fieldVals.forEach((value, key) => {
    if (value !== undefined && value?.trim() !== "") {
      updates.push(`${key} = ?`);
      nonEmptyFields.push(value);
    }
  });

  sqlQuery += updates.join(", ");
  sqlQuery += " WHERE id = ?;";

  db.query(sqlQuery, [...nonEmptyFields, studentId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Some error occurred while updating student details",
      });
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: `Student with id ${studentId} not found`,
      });
    }

    return res
      .status(201)
      .json({ success: true, message: "Student details updated successfully" });
  });
};

// @description Delete the student details
// @route DELETE api/student/delete/:studentId
// @access PUBLIC
const deleteStudentDetails = (req, res) => {
  const { studentId } = req.params;

  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Student ID" });
  }

  const sqlQuery = "DELETE FROM student WHERE id = ?";
  db.query(sqlQuery, [studentId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `Some error occurred while deleting student with id ${studentId}`,
      });
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: `Student with id ${studentId} not found`,
      });
    }

    return res.status(201).json({
      success: true,
      message: `Student with id ${studentId} deleted successfully`,
    });
  });
};

module.exports = {
  addStudentDetails,
  getStudentDetails,
  getSpecificStudentDetails,
  updateStudentDetails,
  deleteStudentDetails,
};
