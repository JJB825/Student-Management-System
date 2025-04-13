import axios from "axios";
import { useEffect } from "react";
import { useStudentContext } from "./useStudentContext";
import { actions } from "../utils/actions";

const useFetch = () => {
  const { dispatch } = useStudentContext();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get("/api/student/view");
        dispatch({
          type: actions.DISPLAY_STUDENTS,
          payload: response.data.data,
        });
      } catch (error) {
        console.error("Failed to fetch student data: ", error);
      }
    };
    fetchStudentData();
  }, [dispatch]);
};

export default useFetch;
