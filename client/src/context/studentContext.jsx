import { createContext, useReducer } from "react";
import reducer from "../utils/reducer";

export const StudentContext = createContext();

export const StudentContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    students: [],
  });

  return (
    <StudentContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StudentContext.Provider>
  );
};
