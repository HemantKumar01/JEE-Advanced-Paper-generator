//! SET BELOW MANUALLY
var paperCode = "JEE-2013-P2";

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
  console.log("Please edit testFrame.json accordingly");
}
