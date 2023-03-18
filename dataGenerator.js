var fs = require("fs");
var data = {
  "JEE-2007-P1": {},
  "JEE-2007-P2": {},
  "JEE-2008-P1": {},
  "JEE-2008-P2": {},
};
for (var i = 1; i <= 66; i++) {
  data["JEE-2007-P1"][i] = {
    q: `<img src="../JEE_Advanced_Papers/JEE-2007-P1/${i}.png">`,
    ans: "",
    o1: "A",
    o2: "B",
    o3: "C",
    o4: "D",
  };
}
for (var i = 1; i <= 66; i++) {
  data["JEE-2007-P2"][i] = {
    q: `<img src="../JEE_Advanced_Papers/JEE-2007-P2/${i}.png">`,
    ans: "",
    o1: "A",
    o2: "B",
    o3: "C",
    o4: "D",
  };
}
for (var i = 1; i <= 69; i++) {
  data["JEE-2008-P1"][i] = {
    q: `<img src="../JEE_Advanced_Papers/JEE-2008-P1/${i}.png">`,
    ans: "",
    o1: "A",
    o2: "B",
    o3: "C",
    o4: "D",
  };
}
for (var i = 1; i <= 66; i++) {
  data["JEE-2008-P2"][i] = {
    q: `<img src="../JEE_Advanced_Papers/JEE-2008-P2/${i}.png">`,
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
