//! SET BELOW MANUALLY-----------
const prompt = require("prompt-sync")({ sigint: true });
const paperCode = prompt("Paper Code(JEE-<year>-<P1|P2>) :");
//!-----------------------------

var fs = require("fs");
var data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
var numQues = 0; //will be automatically set below
fs.readdir(`./JEE_Advanced_Papers/${paperCode}`, (err, files) => {
  numQues = files.length;
  fillData();
});

function fillData() {
  var i = 0;
  data[paperCode] = {};
  for (i = 1; i <= numQues; i++) {
    data[paperCode][i] = {
      q: `<img src="/JEE_Advanced_Papers/${paperCode}/${i}.png">`,
      ans: "",
      o1: "A",
      o2: "B",
      o3: "C",
      o4: "D",
    };
  }

  fs.writeFile("./data.json", JSON.stringify(data), function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log(`Data saved successfully. Saved ${numQues} questions`);

  var testFrameTemplate = {
    isVersion2: true,
    TotalQuestions: numQues,
    subjectOrder: ["Physics", "Chemistry", "Maths"],
    sections: {
      "Section 1": {
        type: "Single Correct",
        numQues: 6,
        markingScheme: "+3 : -1",
      },
      "Section 2": {
        type: "Multiple Correct",
        numQues: 8,
        markingScheme: "+4/+1 : -1",
      },
      "Section 3": {
        type: "Numerical",
        numQues: 4,
        markingScheme: "+3 : -0",
      },
    },
  };
  var testFrame = JSON.parse(fs.readFileSync("./testFrame.json", "utf8"));
  testFrame[paperCode] = testFrameTemplate;
  fs.writeFile("./testFrame.json", JSON.stringify(testFrame), function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("Please edit testFrame.json accordingly");
}
