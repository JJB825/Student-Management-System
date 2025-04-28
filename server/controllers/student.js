const initDB = require("../db/connect.js");
let db;
initDB().then((connection) => (db = connection));

const addStudentDetails = async (req, res) => {
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

  try {
    const [existingStudents] = await db.execute(
      "SELECT * FROM student WHERE stname = ?",
      [stname]
    );

    const newStudent = { stname, course, fee: parseInt(fee), mobile };
    const existingStudent = existingStudents[0];

    if (existingStudent) {
      delete existingStudent.id;
      if (JSON.stringify(existingStudent) === JSON.stringify(newStudent)) {
        return res.status(404).json({
          success: false,
          message: "Student exists with same details",
        });
      }
    }

    await db.execute(
      "INSERT INTO student (stname, course, fee, mobile) VALUES (?, ?, ?, ?)",
      [stname, course, fee, mobile]
    );

    return res
      .status(201)
      .json({ success: true, message: "New Student added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred while adding new student",
    });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM student");
    return res.status(200).json({
      success: true,
      message: "Student details fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred while fetching details",
    });
  }
};

const getSpecificStudentDetails = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Student ID" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM student WHERE id = ?", [
      studentId,
    ]);

    if (!rows.length) {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred while fetching student details",
    });
  }
};

const updateStudentDetails = async (req, res) => {
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

  let sqlQuery = "UPDATE student set ";
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
  sqlQuery += " where id = ?;";

  try {
    const [result] = await db.execute(sqlQuery, [...nonEmptyFields, studentId]);

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: `Student with id ${studentId} not found`,
      });
    }

    return res
      .status(201)
      .json({ success: true, message: "Student details updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred while updating student details",
    });
  }
};

const deleteStudentDetails = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Student ID" });
  }

  try {
    const [result] = await db.execute("DELETE FROM student WHERE id = ?", [
      studentId,
    ]);

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Some error occurred while deleting student`,
    });
  }
};

module.exports = {
  addStudentDetails,
  getStudentDetails,
  getSpecificStudentDetails,
  updateStudentDetails,
  deleteStudentDetails,
};
