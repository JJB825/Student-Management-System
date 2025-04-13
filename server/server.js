import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import studentRouter from "../server/routes/student.js";

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
