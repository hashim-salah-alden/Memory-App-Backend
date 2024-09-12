require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const memoriesRouter = require("./routes/memories.route");
const usersRouter = require("./routes/users.route");
const httpStatusText = require("./utils/httpStatusText");

const app = express();

app.use("/uploads", express.static("uploads"));

const mongoUrl = process.env.MONGO_URL;

app.use(cookieParser());
app.use(cors());

mongoose.connect(mongoUrl).then(() => {
  console.log("mongodb server started");
});

app.use(express.json());

// routes for memories and users
app.use("/api/memories", memoriesRouter); // /api/courses
app.use("/api/users", usersRouter); // /api/users

// handle global errors
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: "null",
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
