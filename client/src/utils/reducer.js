import { actions } from "./actions";

const reducer = (state, action) => {
  switch (action.type) {
    case actions.DISPLAY_STUDENTS:
      return { students: action.payload };
    case actions.CREATE_STUDENT:
      return { students: [action.payload, ...state.students] };
    case actions.UPDATE_STUDENT:
      return { students: action.payload };
    case actions.DELETE_STUDENT:
      return {
        students: state.students.filter(
          (student) => student.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default reducer;
