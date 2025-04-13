import { Router } from "express";
import {
  addStudentDetails,
  getStudentDetails,
  getSpecificStudentDetails,
  updateStudentDetails,
  deleteStudentDetails,
} from "../controllers/student.js";
const router = Router();

router.route("/add").post(addStudentDetails);
router.route("/view").get(getStudentDetails);
router.route("/view/:studentId").get(getSpecificStudentDetails);
router.route("/update/:studentId").patch(updateStudentDetails);
router.route("/delete/:studentId").delete(deleteStudentDetails);

export default router;
