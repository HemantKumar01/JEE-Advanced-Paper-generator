const express = require("express");
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });
const open = require("open");
const app = express();
const port = 3000;

const socket = require("socket.io");

var data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
var done = JSON.parse(fs.readFileSync("./stats/done.json", "utf8"));

var topics = Object.keys(data);
var test = {};
var paperNo = prompt("JEE-<JEEAdv-Year>-<P1|P2> or dq:"); //change 2min/ques from script.js

var isDq = false;
if (paperNo == "dq") {
  paperNo = data["dq"].config.testName;
  isDq = true;
}

var testFrame = JSON.parse(fs.readFileSync("./testFrame.json", "utf8"))[
  paperNo
];
if (data[paperNo].config) {
  delete data[paperNo].config;
}
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

app.use(express.static("public"));
app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io/client-dist/")
);
app.use(
  "/JEE_Advanced_Papers",
  express.static(__dirname + "/JEE_Advanced_Papers/")
);

const serverInstance = app.listen(port, () => {
  test = {};
  done = JSON.parse(fs.readFileSync("./stats/done.json", "utf8"));
  createPaper();
  console.log(testFrame);

  console.log(`app listening on port ${port}`);
  open("http://localhost:3000");
});
const io = new socket.Server(serverInstance);

io.on("connection", (socket) => {
  socket.on("result", (testSubmitData) => {
    testSubmitData = JSON.parse(testSubmitData);

    console.log("Test submitted successfully. Saved for DQ");

    data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
    testSubmitData.config = { testName: paperNo };
    data["dq"] = testSubmitData;
    fs.writeFile("./data.json", JSON.stringify(data), function (err) {
      if (err) {
        console.log(err);
      }
    });
  });
});

function createPaper() {
  var qno = 0;
  for (var subject of Object.keys(testFrame)) {
    var section = 0;
    for (var subTopic of Object.keys(testFrame[subject])) {
      if (testFrame[subject][subTopic].start != 0) {
        section++;
        if (isDq) {
          test[`${subject} Section ${section}`] =
            data["dq"][`${subject} Section ${section}`];
        } else {
          for (
            qno = testFrame[subject][subTopic].start;
            qno <= testFrame[subject][subTopic].end;
            qno++
          ) {
            if (!test[`${subject} Section ${section}`]) {
              test[`${subject} Section ${section}`] = [subTopic]; //1st index is the subtopic of section (type of section)
            }
            test[`${subject} Section ${section}`].push(data[paperNo][qno]);
          }
        }
      }
    }
  }
  var testData = { config: { isDq: isDq }, topics: test };
  fs.writeFile(
    "./public/testData.json",
    JSON.stringify(testData),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
}
