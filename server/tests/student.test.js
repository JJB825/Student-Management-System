jest.mock("../db/connect.js", () => {
  return jest.fn().mockResolvedValue({
    execute: jest.fn(),
  });
});

let initDB, db, controller;

beforeAll(async () => {
  initDB = require("../db/connect.js");
  db = await initDB();
  controller = require("../controllers/student.js");
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("Add Student Details", () => {
  it("should return error if fields are missing", async () => {
    const req = { body: { stname: "", course: "", fee: "", mobile: "" } };
    const res = mockResponse();
    await controller.addStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return error for invalid fee", async () => {
    const req = {
      body: { stname: "Amit", course: "CS", fee: "abc", mobile: "9876543210" },
    };
    const res = mockResponse();
    await controller.addStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return error for invalid mobile", async () => {
    const req = {
      body: { stname: "Amit", course: "CS", fee: "5000", mobile: "12345" },
    };
    const res = mockResponse();
    await controller.addStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return duplicate student error", async () => {
    db.execute.mockResolvedValueOnce([
      [{ stname: "Amit", course: "CS", fee: 10000, mobile: "+919876543210" }],
    ]);
    const req = {
      body: {
        stname: "Amit",
        course: "CS",
        fee: "10000",
        mobile: "+919876543210",
      },
    };
    const res = mockResponse();
    await controller.addStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should add student successfully", async () => {
    db.execute.mockResolvedValueOnce([[]]); // no existing student
    db.execute.mockResolvedValueOnce(); // insert success
    const req = {
      body: {
        stname: "Rasha",
        course: "ML",
        fee: "5000",
        mobile: "+919876543210",
      },
    };
    const res = mockResponse();
    await controller.addStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("Get All Student Details", () => {
  it("should return all student records", async () => {
    const mockData = [{ id: 1, stname: "Amit" }];
    db.execute.mockResolvedValueOnce([mockData]);
    const req = {};
    const res = mockResponse();
    await controller.getStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("Get Specific Student Details", () => {
  it("should return error for invalid ID", async () => {
    const req = { params: { studentId: "abc" } };
    const res = mockResponse();
    await controller.getSpecificStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return not found for unknown ID", async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const req = { params: { studentId: "999" } };
    const res = mockResponse();
    await controller.getSpecificStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return student details for valid ID", async () => {
    const student = { id: 13, stname: "Amit" };
    db.execute.mockResolvedValueOnce([[student]]);
    const req = { params: { studentId: "13" } };
    const res = mockResponse();
    await controller.getSpecificStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("Update Student Details", () => {
  it("should return error for invalid ID", async () => {
    const req = { params: { studentId: "xyz" }, body: {} };
    const res = mockResponse();
    await controller.updateStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return not found for unknown ID", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const req = { params: { studentId: "999" }, body: { stname: "" } };
    const res = mockResponse();
    await controller.updateStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return error if all fields are missing", async () => {
    const req = {
      params: { studentId: "1" },
      body: { stname: "", course: "", fee: "", mobile: "" },
    };
    const res = mockResponse();
    await controller.updateStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return error for invalid fee", async () => {
    const req = { params: { studentId: "1" }, body: { fee: "abc" } };
    const res = mockResponse();
    await controller.updateStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return error for invalid mobile", async () => {
    const req = { params: { studentId: "1" }, body: { mobile: "123" } };
    const res = mockResponse();
    await controller.updateStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should update student successfully", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const req = { params: { studentId: "13" }, body: { course: "AI" } };
    const res = mockResponse();
    await controller.updateStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("Delete Student Details", () => {
  it("should return error for invalid ID", async () => {
    const req = { params: { studentId: "abc" } };
    const res = mockResponse();
    await controller.deleteStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return not found for unknown ID", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const req = { params: { studentId: "999" } };
    const res = mockResponse();
    await controller.deleteStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should delete student successfully", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const req = { params: { studentId: "14" } };
    const res = mockResponse();
    await controller.deleteStudentDetails(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
