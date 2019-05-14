import express from "express";
import * as bodyParser from "body-parser";
import * as envConfig from "./config.json";
import clc from "cli-color";

const app = express();
const fallbackPort = 4444;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/test", (req, res) => {
  res.send("It works!");
});

const port = process.env.PORT || envConfig.APPPORT || fallbackPort;
app.listen(port, () =>
  console.log(
    clc.red("!!! "),
    clc.blue(" Server started listening on port:"),
    clc.black.bgYellowBright(` ${port} `)
  )
);
