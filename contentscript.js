document.onmouseup = function run(event1) {
  var echoForm = false

  if (window.getSelection() != "") {
    var keys = [];

    onkeydown = onkeyup = function(event2) {
      keys[event2.keyCode] = event2.type == 'keydown';

      if ( (keys[17] === true) && (keys[69] === true) ) {
        event2.preventDefault();

        if ( echoForm === false ) {
          var selectedString = window.getSelection().toString();
          // not protected variable!
          spawnedEcho = spawnEchoForm(event1.pageX, event1.pageY, this);
          echoForm = true;

          console.log("Before submit: " + selectedString);

          var userTextandSubmitForm = document.getElementById("userTextAndSubmit");
          userTextandSubmitForm.addEventListener("submit", function(event3){
            event3.preventDefault();

            console.log("Button submit: " + selectedString);

            var userText = document.getElementById("userText").value;

            closeEchoFormAfterSubmit(selectedString);
            echoForm = false;

            chrome.runtime.sendMessage({
              message: selectedString + " " + userText
            }, function(response) {
              console.log(response.message);
            });
          });
        };

        document.onmousedown = function run(event4, selectedString) {
          console.log("Inside hide: " + selectedString);
          hideSpawnedEcho(event4, selectedString);
        };
      };
    };
  };
};

function closeEchoFormAfterSubmit(selectedString) {
  var echoFrame = document.getElementsByClassName("echo-frame")[0];
  body.removeChild(echoFrame);
  spawnedEcho = null;
  removeHighlight(selectedString);
};

function spawnEchoForm(x, y, that) {
  that.echoForm = document.createElement("div");
  that.echoForm.setAttribute("class", "echo-frame");

  that.echoSubmit = document.createElement("div");
  that.echoSubmit.setAttribute("class", "echo-submit");
  that.echoForm.appendChild(that.echoSubmit);

  that.echoInputForm = document.createElement("form");
  that.echoInputForm.setAttribute("id", "userTextAndSubmit");
  that.echoSubmit.appendChild(that.echoInputForm);

  that.echoButton = document.createElement("button");
  that.echoButton.setAttribute("type", "submit");
  that.echoInputForm.appendChild(that.echoButton);

  that.echoText = document.createElement("input");
  that.echoText.setAttribute("type", "text");
  that.echoText.setAttribute("id", "userText");
  that.echoText.setAttribute("name", "userText");
  that.echoText.setAttribute("placeholder", "add to your Echo");
  that.echoInputForm.appendChild(that.echoText);

  that.echoTextCharCount = document.createElement("div");
  that.echoTextCharCount.setAttribute("id", "char-count");
  that.echoInputForm.appendChild(that.echoTextCharCount);

  var shortenedUrlLength = 25; //subject to change based on length of shortered URL
  var userSelectedString = window.getSelection().toString();
  var lengthOfUserText = that.echoText.value.length;
  var charCount = userSelectedString.length + shortenedUrlLength + lengthOfUserText;
  that.echoTextCharCount.innerHTML = charCount;

  that.echoText.addEventListener("keyup", function(event) {
    lengthOfUserText = that.echoText.value.length;
    charCount = userSelectedString.length + shortenedUrlLength + lengthOfUserText;
    that.echoTextCharCount.innerHTML = charCount;
  });

  that.fileRef = document.createElement("link");
  that.fileRef.setAttribute("rel", "stylesheet");
  that.fileRef.setAttribute("type", "text/css");
  that.fileRef.setAttribute("href", chrome.extension.getURL("echoform.css"));
  document.getElementsByTagName("head")[0].appendChild(that.fileRef);

  that.echoForm.style.visibility = "visible";

  if ( x > (document.body.clientWidth - 300) ) {
    x = document.body.clientWidth - 310;
    that.echoForm.style.left = x + "px";
  } else {
    that.echoForm.style.left = x + "px";
  };

  y = y + 15;
  that.echoForm.style.top = y + "px";

  body = document.getElementsByTagName("body")[0];
  body.appendChild(that.echoForm);
  textHighlight();
  document.getElementById("userText").focus();
  return true;
};

function hideSpawnedEcho(event, selectedString) {
  var echoFrame = document.getElementsByClassName("echo-frame")[0];

  if (spawnedEcho) {
    if (!checkClickEventWithinForm(event, echoFrame)) {
      body.removeChild(echoFrame);
      spawnedEcho = null;
      removeHighlight(selectedString);
    }
  }
};

function checkClickEventWithinForm(event, parent) {
  var current = event.target;

  while (current) {
    if (current === parent) return true;
    current = current.parentNode;
  }
  return false;
};

function textHighlight() {
  window.getSelection();

  document.designMode = "on";
  document.execCommand("BackColor", false, "#B6FCD5");
  document.designMode = "off";
}

function removeHighlight(selectedString) {
  window.find(selectedString);

  document.designMode = "on";
  document.execCommand("BackColor", false, "#FFFFFF");
  document.designMode = "off";
  window.getSelection().removeAllRanges();
}
