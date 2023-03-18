const express = require("express");
const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });
const open = require("open");
const app = express();
const port = 5000;

var submissionTime = prompt(
  "enter submission time of test(visit stats/done.json):"
);
var data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
var test;
var done = JSON.parse(fs.readFileSync("./stats/done.json", "utf8"));

app.get("/", (req, res) => {
  test = { Maths: [null] };
  done = JSON.parse(fs.readFileSync("./stats/done.json", "utf8"));
  createPaper();
  res.sendFile("index.html", { root: "./public" });
});

app.use(express.static("public"));
app.listen(port, () => {
  console.log(
    "Test Data Set to older session. Please Manually select answers you have selected previously and submit test"
  );
  console.log(`app listening on port ${port}`);
  open(`http://localhost:${port}`);
});
app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io/client-dist/")
);
function createPaper() {
  for (var topic of Object.keys(done)) {
    for (var index of Object.keys(done[topic])) {
      if (!done[topic][index].submissionTime) {
        done[topic][index].submissionTime = 0;
      }
      if (done[topic][index].submissionTime == submissionTime) {
        test.Maths.push(data[topic][index]);
        test.Maths[test.Maths.length - 1].timeTaken =
          done[topic][index].timeTaken * 60;
        test.Maths[test.Maths.length - 1].selectedOption =
          done[topic][index].selectedOption;
      }
    }
  }

  fs.writeFile("./public/testData.json", JSON.stringify(test), function (err) {
    if (err) {
      console.log(err);
    }
  });
}
