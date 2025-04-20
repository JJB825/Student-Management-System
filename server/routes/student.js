const Router = require("express");
const {
  addStudentDetails,
  getStudentDetails,
  getSpecificStudentDetails,
  updateStudentDetails,
  deleteStudentDetails,
} = require("../controllers/student.js");
const router = Router();

router.route("/add").post(addStudentDetails);
router.route("/view").get(getStudentDetails);
router.route("/view/:studentId").get(getSpecificStudentDetails);
router.route("/update/:studentId").patch(updateStudentDetails);
router.route("/delete/:studentId").delete(deleteStudentDetails);

module.exports = router;
