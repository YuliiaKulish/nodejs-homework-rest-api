const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./contacts/router");
const usersRouter = require("./users/router");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app
  .use(logger(formatsLogger))
  .use(cors())
  .use(express.json())
  .use("/api/contacts", contactsRouter)
  .use("/users", usersRouter)
  .use((req, res) => {
    res.status(404).json({ status: "error", code: 404, message: "Not found" });
  })
  .use((err, req, res, next) => {
    const status = err.status || 500;
    res
      .status(status)
      .json({ status: "fail", code: status, message: err.message });
  });

module.exports = app;
