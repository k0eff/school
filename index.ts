import express from "express";
import * as bodyParser from "body-parser";
import * as envConfig from "./config.json";
import clc from "cli-color";
import mongoose from "mongoose";

import ParametersRouter from "./src/router/ParametersRouter";
import EduPlanRouter from "./src/router/EduPlanRouter";

const app = express();
const fallbackPort = 4444;

// Inject Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up DB Connection
mongoose
  .connect(envConfig.mongo.connstring, {
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("It works!");
});

app.use("/api/params", ParametersRouter);
app.use("/api/eduPlan", EduPlanRouter);

const port = process.env.PORT || envConfig.APPPORT || fallbackPort;
app.listen(port, () =>
  console.log(
    clc.red("!!! "),
    clc.blue(" Server started listening on port:"),
    clc.black.bgYellowBright(` ${port} `),
    " "
  )
);
