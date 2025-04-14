import { db } from "../db/connect.js";

// @description Add new student details
// @route POST api/student/add
// @access PUBLIC
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

  if (isNaN(mobile)) {
    return res
      .status(404)
      .json({ success: false, message: "Mobile must be a valid number" });
  }

  // see for duplicate entry
  const duplicateEntryCheckQuery = "SELECT * FROM student WHERE stname = ?";
  const newStudent = {
    stname: stname,
    course: course,
    fee: parseInt(fee),
    mobile: mobile,
  };
  const [rows] = await db.execute(duplicateEntryCheckQuery, [stname]);
  let existingStudent = rows[0];
  if (existingStudent) {
    delete existingStudent.id;

    if (JSON.stringify(existingStudent) === JSON.stringify(newStudent)) {
      return res
        .status(404)
        .json({ success: false, message: "Student exists with same details" });
    }
  }

  const values = [stname, course, fee, mobile];
  const sqlQuery =
    "INSERT INTO student (stname, course, fee, mobile) VALUES (?,?,?,?)";

  try {
    await db.execute(sqlQuery, values);
    return res
      .status(201)
      .json({ success: true, message: "New Student added successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while adding new student",
    });
  }
};

// @description View student details
// @route GET api/student/view
// @access PUBLIC
const getStudentDetails = async (req, res) => {
  const sqlQuery = "SELECT * FROM student";

  try {
    const [rows] = await db.execute(sqlQuery);
    return res.status(200).json({
      success: true,
      message: "Student details fetched successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while fetching details",
    });
  }
};

// @description Search Student Details
// @route GET api/student/:studentId
// @access PUBLIC
const getSpecificStudentDetails = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Student ID" });
  }

  const sqlQuery = "SELECT * FROM student WHERE id = ?";
  try {
    const [rows] = await db.execute(sqlQuery, [studentId]);
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while fetching student details",
    });
  }
};

// @description Update the student details
// @route PATCH api/student/update/:studentId
// @access PUBLIC
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

  if (mobile !== undefined && mobile?.trim() !== "" && isNaN(mobile)) {
    return res
      .status(404)
      .json({ success: false, message: "Mobile must be a valid number" });
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
    return res.status(201).json({
      success: true,
      message: "Student details updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while updating student details",
    });
  }
};

// @description Delete the student details
// @route DELETE api/student/delete/:studentId
// @access PUBLIC
const deleteStudentDetails = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId || isNaN(studentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Student ID" });
  }

  const sqlQuery = "DELETE FROM student WHERE id = ?";
  try {
    const [result] = await db.execute(sqlQuery, [studentId]);
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
    return res.status(500).json({
      success: false,
      message: `Some error occurred while deleting student with id ${studentId}`,
    });
  }
};

export {
  addStudentDetails,
  getStudentDetails,
  getSpecificStudentDetails,
  updateStudentDetails,
  deleteStudentDetails,
};
