let currentSlide = 0;
var currentTopic = null;

const nextButton = document.getElementById("next");
const markButton = document.getElementById("mfran");
const clearButton = document.getElementById("cr");

var quesContainers = null;
var quesContainer = null;
var interval = null;
var numQues = 0;
// var totalTime = 3 * 60 * 60; //in sec (=> it's 3hr)
var totalTime = 180 * 60;
var remainingTime = 0;
var isDq = false;
var socket;

data = {};
async function init() {
  loadedJSON = await fetch("./testData.json");
  loadedJSON = await loadedJSON.json();
  data = JSON.parse(JSON.stringify(loadedJSON));
  console.log(data);
  // if (data.Maths[1].timeTaken) {
  //   //TODO: change in future to make it better (suppose i have more topics);
  //   isDq = true;
  // }
  isDq = !!data.config.isDq; //false if data.isDq undefined;
  data = data.topics;
  if (!isDq) {
    socket = io();
  }
  numQues = 0;
  for (var topic of Object.keys(data)) {
    numQues += data[topic].length - 1;
  }
  remainingTime = totalTime;
  getTopics();
  if (!isDq) {
    runTimer();
  } else {
    document.querySelector("#submit").click();
  }
}
window.onload = init;

//initialize
var a = "cd";
var obj;
var objo;
var topics = [];

function runTimer() {
  interval = setInterval(() => {
    if (!quesContainer) {
      return;
    }
    time = parseInt(quesContainer.getAttribute("data-timer"));
    quesContainer.setAttribute("data-timer", (time + 1).toString());
    data[currentTopic][currentSlide + 1].timeTaken = time + 1;
    remainingTime--;
    if (remainingTime <= 0) {
      document.querySelector("#submit").click();
      return;
    }
    document.querySelector("#remainingTime").innerHTML = `${(
      (remainingTime - (remainingTime % 60)) /
      60
    )
      .toString()
      .padStart(2, "0")}:${(remainingTime % 60).toString().padStart(2, "0")}`;
  }, 1000);
}

function getTopics() {
  topics = Object.keys(data);
  topicTabsContainer = document.querySelector("#section_names");
  topicTabsContainer.innerHTML = "";
  for (topic of topics) {
    topicTabsContainer.innerHTML += `<div class = 'section_unselected' data-topic = "${topic}" onclick="loadTopic('${topic}')">${topic}</div>`;
  }
  topicTabsContainer.firstChild.click();
}

// key1 and etc...
/*list.addEventListener("change",function(){
      loadTopic(this.value);
      
    });*/

async function loadTopic(top) {
  currentTopic = top;
  allTabElements = document.querySelectorAll("[data-topic]");
  for (element of allTabElements) {
    element.className = "section_unselected";
  }

  var tabElement = document.querySelector("[data-topic='" + top + "']");
  tabElement.className = "section_selected";
  obj = data[top];
  currentSlide = 0;
  start(obj, top);
}
function showResults() {
  // gather answer containers from our quiz
  clearInterval(interval);
  if (!isDq) {
    socket.emit("result", JSON.stringify(data));
  }
  isDq = true;

  var firstTopic = Object.keys(data)[0];
  console.log(firstTopic);
  loadTopic(firstTopic);
  document.querySelector("#next_options").style.display = "none";
  document.querySelector("#submit_container").style.display = "none";

  // var timeUsed = totalTime - remainingTime;
  // const answerContainers = quizContainer.querySelectorAll(".answers");
  // // var dc = palette.childNodes;

  // // keep track of user's answers
  // // let numCorrect = 0;
  // // let testStats = { sessionData: {}, attemptedQues: {} }; //{questionNum: timeTaken}
  // // var index = [];

  // // for (var x in obj1) {
  // //   index.push(x);
  // // }
  // numAnswersAttempted = 0;
  // // for each question...
  // for (var i = 1; i <= Object.keys(obj1).length - 1; i++) {
  //   var qname = index[i];

  //   // find selected answer
  //   const answerContainer = answerContainers[i - 1];
  //   const time = quesContainers[i - 1].getAttribute("data-timer");
  //   //displaying time taken
  //   quesContainers[i - 1].innerHTML =
  //     `<span class="timeTaken">[${(parseInt(time) / 60).toFixed(
  //       2
  //     )} min]</span><br>` + quesContainers[i - 1].innerHTML; //adding attempted Time
  //   quesContainers[i - 1].innerHTML =
  //     quesContainers[i - 1].innerHTML +
  //     `<br>[ANS: ${quesContainers[i - 1].getAttribute("data-answer")}]`; //adding answer (if in data)

  //   const selector = `input:checked`;
  //   //to filter out unattempted questions(question with no answer and less than 1 min spent)
  //   if (
  // //    !answerContainer.querySelector(selector) &&
  //     parseInt(quesContainers[i - 1].getAttribute("data-timer")) < 60
  //   ) {
  //     dc[i - 1].style.display = "none";
  //     continue;
  //   }
  //   if (answerContainer.querySelector(selector)) {
  //     selectedOption = answerContainer.querySelector(selector).value; //belongs to {A,B,C,D}
  //   }
  //   testStats.attemptedQues[i] = {
  //     timeTaken: parseInt(quesContainers[i - 1].getAttribute("data-timer")),
  //     selectedOption: selectedOption,
  //   };

  //   // (NOT TO INCLUDE ATTEMPTED BUT NOT ANSWERED below)include only answered questions in counting number of answered questions
  //   if (answerContainer.querySelector(selector)) {
  //     numAnswersAttempted++;
  //   }
  // }
  // if (!isDq) {
  //   alert(
  //     `Congratulations, you have attempted ${numAnswersAttempted} questions in ${(
  //       timeUsed / 60
  //     ).toFixed(2)} minutes. Average Time = ${(
  //       timeUsed /
  //       60 /
  //       numAnswersAttempted
  //     ).toFixed(2)} min/ques`
  //   );
  //   testStats.sessionData = {
  //     submissionTime: Date.now(),
  //     numAnswered: numAnswersAttempted,
  //     timeUsed: (timeUsed / 60).toFixed(2),
  //     avgTime: (timeUsed / 60 / numAnswersAttempted).toFixed(2),
  //   };
  //   socket.emit("result", JSON.stringify(testStats));
  // }
}

function start(obj1, top1) {
  var palette = document.getElementById("palette-list");
  palette.innerHTML = "";
  const output = [];

  var index = [];

  for (var x in obj1) {
    index.push(x);
  }

  var keyys = Object.keys(obj1);

  const previousButton1 = document.getElementById("pre");
  const chooseText = document.getElementById("choose_text");

  previousButton1.style.opacity = "0";
  palette.classList.remove("non_clickable");

  for (var i = 0; i < index.length - 1; i++) {
    const answers = [];
    //var qname2 = "Q" + i.toString();
    var qname = i + 1;
    if (!obj1[qname].selectedOptions) {
      obj1[qname].selectedOptions = [];
    }
    if (obj1[0] == "Single Correct") {
      answers.push(
        `<label>
          <input type="radio" name="${qname}" value="A" ${
          obj1[qname].selectedOptions.includes("A") ? "checked" : " "
        }>
          ${obj1[qname].o1}
          </label>`
      );
      answers.push(
        `<label>
            <input type="radio" name="${qname}" value="B" ${
          obj1[qname].selectedOptions.includes("B") ? "checked" : " "
        }>
                  ${obj1[qname].o2}
                  </label>`
      );
      answers.push(
        `<label>
                    <input type="radio" name="${qname}" value="C" ${
          obj1[qname].selectedOptions.includes("C") ? "checked" : " "
        }>
                    ${obj1[qname].o3}
                    </label>`
      );
      answers.push(
        `<label>
      <input type="radio" name="${qname}" value="D" ${
          obj1[qname].selectedOptions.includes("D") ? "checked" : " "
        }>
      ${obj1[qname].o4}
      </label>`
      );
    } else if (obj1[0] == "Multiple Correct") {
      answers.push(
        `<label>
          <input type="checkbox" name="${qname}" value="A" ${
          obj1[qname].selectedOptions.includes("A") ? "checked" : " "
        }>
          ${obj1[qname].o1}
          </label>`
      );
      answers.push(
        `<label>
            <input type="checkbox" name="${qname}" value="B" ${
          obj1[qname].selectedOptions.includes("B") ? "checked" : " "
        }>
                  ${obj1[qname].o2}
                  </label>`
      );
      answers.push(
        `<label>
                    <input type="checkbox" name="${qname}" value="C" ${
          obj1[qname].selectedOptions.includes("C") ? "checked" : " "
        }>
                    ${obj1[qname].o3}
                    </label>`
      );
      answers.push(
        `<label>
      <input type="checkbox" name="${qname}" value="D" ${
          obj1[qname].selectedOptions.includes("D") ? "checked" : " "
        }>
      ${obj1[qname].o4}
      </label>`
      );
    } else if (obj1[0] == "Numeric" || obj1[0] == "Integer") {
      answers.push(
        `<label>
          <input type="number" name="${qname}" value="${
          obj1[qname].selectedOptions[0] ? obj1[qname].selectedOptions[0] : ""
        }">
          </label>`
      );
    } else if (obj1[0] == "Matrix Match") {
      answers.push(
        `<label>
        ${obj1[qname].o1}
          <input type="text" name="${qname}" value="${
          obj1[qname].selectedOptions[0] ? obj1[qname].selectedOptions[0] : ""
        }" placeholder="p ,q,r,s">
          
          </label>`
      );
      answers.push(
        `<label>
        ${obj1[qname].o2}
          <input type="text" name="${qname}" value="${
          obj1[qname].selectedOptions[1] ? obj1[qname].selectedOptions[1] : ""
        }" placeholder="p,q,r,s">
          
          </label>`
      );
      answers.push(
        `<label>
        ${obj1[qname].o3}
          <input type="text" name="${qname}" value="${
          obj1[qname].selectedOptions[2] ? obj1[qname].selectedOptions[2] : ""
        }" placeholder="p,q,r,s">
          
          </label>`
      );
      answers.push(
        `<label>
        ${obj1[qname].o4}
          <input type="text" name="${qname}" value="${
          obj1[qname].selectedOptions[3] ? obj1[qname].selectedOptions[3] : ""
        }" placeholder="p,q,r,s">
          
          </label>`
      );
    }

    if (!obj1[qname].ans) {
      obj1[qname].ans = "...";
    }
    // add this question and its answers to the output
    var x = output.push(
      `<div class="slide">${
        isDq
          ? `<span class="timeTaken">[${(
              parseInt(obj1[qname].timeTaken ? obj1[qname].timeTaken : 0) / 60
            ).toFixed(2)} min]</span><br>`
          : ""
      }
        <div class="question" data-answer="${obj1[qname].ans}" data-timer= "${
        obj1[qname].timeTaken ? obj1[qname].timeTaken : 0
      }"> ${obj1[qname].q} </div>
        <div class="answers"> ${answers.join("")} </div>
        </div>`
    );

    var node = document.createElement("div");

    if (!obj1[qname].selectedOptions || !obj1[qname].selectedOptions.length) {
      node.classList.add("na");
    } else {
      node.classList.add("a");
    }

    node.classList.add("item");
    node.innerHTML = (i + 1).toString();
    palette.appendChild(node);
  }
  const quizContainer = document.getElementById("quiz");

  quizContainer.innerHTML = output.join("");
  quesContainers = quizContainer.querySelectorAll(".question");

  MathJax.typesetPromise()
    .then(() => {
      console.warn("Mathjax expression successfully compiled");
    })
    .catch((err) => console.log("Typeset failed: " + err.message));

  function showSlide(n, value, answerGiven = false) {
    var qname = (currentSlide + 1).toString();

    var dc = palette.childNodes;

    if (
      answerGiven &&
      !dc[currentSlide].classList.contains("amr") &&
      !dc[currentSlide].classList.contains("mr")
    ) {
      dc[currentSlide].classList.remove("nv", "na");
      dc[currentSlide].classList.add("a");
    }
    if (answerGiven && dc[currentSlide].classList.contains("mr")) {
      dc[currentSlide].classList.remove("mr");
      dc[currentSlide].classList.add("amr");
    }

    if (answerGiven && value == true) {
      dc[currentSlide].classList.remove("mr", "amr", "na");
      dc[currentSlide].classList.add("a");
    }

    if (n != index.length - 1) {
      slides[currentSlide].classList.remove("active-slide");
      slides[n].classList.add("active-slide");
      quesContainer = quesContainers[n];

      currentSlide = n;
      qname = (currentSlide + 1).toString();

      obj3 = data[top1];

      var qnoContainer = document.getElementById("question-title");
      var dc = palette.childNodes;
      qnoContainer.innerHTML = "Question no. " + (currentSlide + 1);
      if (dc[currentSlide].classList.contains("nv")) {
        dc[currentSlide].classList.remove("nv");
        dc[currentSlide].classList.add("na");
      }
    } else {
      objKeys = Object.keys(data);
      nextIndex = objKeys.indexOf(currentTopic) + 1;
      if (nextIndex < objKeys.length) {
        nextTopic = objKeys[nextIndex];
        loadTopic(nextTopic);
      }
    }
  }

  function showNextSlide(currSlide) {
    var answerElements = slides[currSlide].querySelectorAll(
      ".answers>label>input"
    );
    var isAnswerGiven = false;
    for (var element of answerElements) {
      if (element.type == "radio" || element.type == "checkbox") {
        if (element.checked) {
          isAnswerGiven = true;
          if (!data[currentTopic][currSlide + 1].selectedOptions) {
            data[currentTopic][currSlide + 1].selectedOptions = [];
          }
          data[currentTopic][currSlide + 1].selectedOptions.push(element.value);
        }
      } else if (element.type == "text" || element.type == "number") {
        if (element.value) {
          isAnswerGiven = true;
          if (!data[currentTopic][currSlide + 1].selectedOptions) {
            data[currentTopic][currSlide + 1].selectedOptions = [];
          }
          data[currentTopic][currSlide + 1].selectedOptions.push(element.value);
        }
      }
    }
    showSlide(currSlide + 1, true, isAnswerGiven);
  }

  function clearResponse(n) {
    const answerContainer = quizContainer.querySelectorAll(".answers");
    var cc = answerContainer[n].querySelectorAll("input");

    var dc = palette.childNodes;
    dc[n].classList.remove("a");
    dc[n].classList.add("na");
    if (data[currentTopic][n + 1].selectedOptions) {
      data[currentTopic][n + 1].selectedOptions = [];
    }
    for (var i = 0; i < cc.length; i++) {
      if (cc[i].type == "text" || cc[i].type == "number") {
        cc[i].value = "";
      } else {
        cc[i].checked = false;
      }
    }
  }

  function markAndNextSlide(currSlide) {
    var dc = palette.childNodes;
    dc[currSlide].classList.remove("nv", "na", "a");
    dc[currSlide].classList.add("mr");

    var answerElements = slides[currSlide].querySelectorAll(
      ".answers>label>input"
    );
    var isAnswerGiven = false;
    for (var element of answerElements) {
      if (element.type == "radio" || element.type == "checkbox") {
        if (element.checked) {
          isAnswerGiven = true;
          if (!data[currentTopic][currSlide + 1].selectedOptions) {
            data[currentTopic][currSlide + 1].selectedOptions = [];
          }
          data[currentTopic][currSlide + 1].selectedOptions.push(element.value);
        }
      } else if (element.type == "text" || element.type == "number") {
        if (element.value) {
          isAnswerGiven = true;
          if (!data[currentTopic][currSlide + 1].selectedOptions) {
            data[currentTopic][currSlide + 1].selectedOptions = [];
          }
          data[currentTopic][currSlide + 1].selectedOptions.push(element.value);
        }
      }
    }
    showSlide(currSlide + 1, false, isAnswerGiven);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1, false);
  }

  const quizContainer1 = document.getElementById("quiz");
  var resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");

  const previousButton = document.getElementById("pre");

  // display quiz right away
  //buildQuiz();
  const slides = document.querySelectorAll(".slide");

  showSlide(currentSlide, false);

  // on submit, show results
  submitButton.onclick = () => {
    return false;
  };
  submitButton.onclick = () => {
    showResults();
  };

  nextButton.onclick = () => {
    return false;
  };
  nextButton.onclick = () => {
    showNextSlide(currentSlide);
  };
  clearButton.addEventListener("click", () => {
    clearResponse(currentSlide);
  });

  markButton.onclick = () => {
    return false;
  };
  markButton.onclick = () => {
    markAndNextSlide(currentSlide);
  };

  previousButton.addEventListener("click", showPreviousSlide);

  const pContainers = document.querySelectorAll(".item");
  for (var i = 0; i < pContainers.length; i++) {
    pContainers[i].addEventListener("click", function () {
      showSlide(parseInt(this.textContent, 10) - 1, false);
    });
  }
}
