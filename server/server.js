const dotenv = require("dotenv");
dotenv.config({ path: "./env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const studentRouter = require("./routes/student.js");

const server = express();
const port = process.env.PORT || 8000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.listen(port, (error) => {
  if (error) {
    console.error("Error loading the server");
  } else {
    console.log(`Server listening on port ${port}`);
  }
});

server.use("/api/student", studentRouter);
