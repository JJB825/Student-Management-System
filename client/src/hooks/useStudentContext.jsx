import { useContext } from "react";
import { StudentContext } from "../context/studentContext";

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("Student Context not wrapped in StudentContext provider");
  }
  return context;
};
