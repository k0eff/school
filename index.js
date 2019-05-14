"use strict";
exports.__esModule = true;
var express_1 = require("express");
var bodyParser = require("body-parser");
var envConfig = require("./config.json");
var cli_color_1 = require("cli-color");
var app = express_1["default"]();
var fallbackPort = 4444;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/test", function (req, res) {
    res.send("It works!");
});
var port = process.env.PORT || envConfig.APPPORT || fallbackPort;
app.listen(port, function () {
    return console.log(cli_color_1["default"].red("!!! "), cli_color_1["default"].blue(" Server started listening on port:"), cli_color_1["default"].black.bgYellowBright("" + port));
});
