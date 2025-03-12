let tracker = 1;
let max = Object.keys(imgData).length;
let checkboxContainer = document.getElementById("checkbox-window");
let checkbox = document.getElementById("checkbox");
let checkboxSpinner = document.getElementById("spinner");
let verification = document.getElementById("verify-window");
let verificationArrow = document.getElementById("verify-window-arrow");
let verificationButton = document.getElementById("verify-verify-button");
let error = document.getElementById("error");

function clickTile(i) {
  let imgElement = document.getElementById(i);
  let container = imgElement.closest('.image-container');
  
  if(imgElement.className !== "tile-selected") {
    imgElement.className = "tile-selected";
    container.classList.add('tile-selected');
  } else {
    imgElement.className = "tile-unselected";
    container.classList.remove('tile-selected');
  }
}

function fillTiles() {
  // Randomly select a category
  currentCategory = imgData[Math.floor(Math.random() * imgData.length)];
  
  // Shuffle the images
  let shuffledImages = [...currentCategory.images];
  shuffleArray(shuffledImages);

  for(let i = 1; i < 10; i++) {
    let imgElement = document.getElementById(i.toString());
    imgElement.src = shuffledImages[i-1];
    imgElement.className = "tile-unselected";
    let container = imgElement.closest('.image-container');
    container.classList.remove('tile-selected');
  }

  document.getElementById("captcha-name").innerText = currentCategory.name;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function toggleInfoText() {
  var infoText = document.getElementById("info-text");
  if (infoText.style.display === "none" || infoText.style.display === "") {
    infoText.style.display = "block";
  } else {
    infoText.style.display = "none";
  }
}

function clickDetection() {
  if(checkbox && verificationButton) {
    let verifyButtonHandler = function (e) {
      e.preventDefault();
      error.style.display = "block";
      for(let i = 1; i < 10; i++) {
        document.getElementById(i).className = "tile-unselected";
        document.getElementById(i).closest('.image-container').classList.remove('tile-selected');
      }
      fillTiles();
    };

    verificationButton.addEventListener("click", verifyButtonHandler);

    checkbox.addEventListener("click", function (e) {
      e.preventDefault();
      checkbox.disabled = true;
      spinner();
    });

    let reloadButton = document.querySelector('.footer-left-button-reload');
    if (reloadButton) {
      reloadButton.addEventListener('click', resetAndFillTiles);
    } 

    let infoButton = document.querySelector('.footer-left-button-info');
    let infoButtonHandler = toggleInfoText;
    if (infoButton) {
      infoButton.addEventListener('click', infoButtonHandler);
    }

    let audioButton = document.querySelector('.footer-left-button-audio');
    if (audioButton) {
      audioButton.addEventListener('click', function() {
        toggleAudioMessage();
        // Remove event listeners for verify and info buttons
        verificationButton.removeEventListener("click", verifyButtonHandler);
        infoButton.removeEventListener('click', infoButtonHandler);
      });
    }

    window.addEventListener('click', function(e) {
      if(verification.contains(e.target) || checkboxContainer.contains(e.target)) {
      } else {
        hideVerification();
      }
    });
  }
}

function spinner() {
  checkbox.style.width = "4px";
  checkbox.style.height = "4px";
  checkbox.style.borderRadius = "50%";
  checkbox.style.marginLeft = "25px";
  checkbox.style.marginTop = "33px";
  checkbox.style.opacity = "0";

  setTimeout(function() {
    checkboxSpinner.style.visibility = "visible";
    checkboxSpinner.style.opacity = "1";
  }, 500)
  setTimeout(function() {
    displayVerification();
  }, 900)
}

function displayVerification() {
  verification.style.display = "block";
  verification.style.visibility = "visible";
  verification.style.opacity = "1";
  verification.style.top = checkboxContainer.offsetTop - 80 + "px";
  verification.style.left =  checkboxContainer.offsetLeft + 54 + "px";

  if(verification.offsetTop < 5) {
    verification.style.top = "5px";
  }

  if(verification.offsetLeft + verification.offsetWidth > window.innerWidth-10) {
    verification.style.left =  checkboxContainer.offsetLeft - 8  + "px";
  } else {
    verificationArrow.style.top = checkboxContainer.offsetTop + 24 + "px";
    verificationArrow.style.left = checkboxContainer.offsetLeft + 45 + "px";
    verificationArrow.style.visibility = "visible";
    verificationArrow.style.opacity = "1";
  }
}

function toggleAudioMessage() {
  const verifyContainer = document.querySelector('.verify-container');
  const audioMessage = document.getElementById('audio-message');
  const verifyTiles = document.querySelector('.verify-tiles');
  const verifyHeader = document.querySelector('.verify-header');
  const footer = document.querySelector('.verify-footer');
  const verifyButton = document.getElementById('verify-verify-button');
  const audioButton = document.querySelector('.footer-left-button-audio');
  const infoButton = document.querySelector('.footer-left-button-info');

  // Hide the image verification and show the audio message
  verifyTiles.style.display = 'none';
  verifyHeader.style.display = 'none';
  audioMessage.style.display = 'block';
  
  // Move the footer after the audio message
  audioMessage.parentNode.insertBefore(footer, audioMessage.nextSibling);
  
  // Disable the audio button
  audioButton.disabled = true;
  
  // Add grey overlay to verify button and disable it
  verifyButton.disabled = true;
  verifyButton.style.position = 'relative';
  verifyButton.style.backgroundColor = '#5a89e2';
  verifyButton.insertAdjacentHTML('afterbegin', '<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(128, 128, 128, 0.5);"></div>');
  
  // Disable the info button
  infoButton.disabled = true;
}

function hideVerification() {
  verification.style.display = "none";
  verification.style.visibility = "hidden";
  verification.style.opacity = "0";
  verificationArrow.style.visibility = "hidden";
  verificationArrow.style.opacity = "0";
  checkbox.style.width = "100%";
  checkbox.style.height = "100%";
  checkbox.style.borderRadius = "2px";
  checkbox.style.margin = "21px 0 0 12px";
  checkbox.style.opacity = "1";
  checkboxSpinner.style.visibility = "hidden";
  checkboxSpinner.style.opacity = "0";
  checkbox.disabled = false;
  verificationButton.disabled = false;
}

document.getElementById("audio-challenge-button").addEventListener("click", function() {
    // Hide other elements and show the audio message
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "show-audio-message-only.css";
    document.head.appendChild(link);
}

function resetAndFillTiles() {
  for(let i = 1; i < 10; i++) {
    let imgElement = document.getElementById(i.toString());
    imgElement.className = "tile-unselected";
    let container = imgElement.closest('.image-container');
    container.classList.remove('tile-selected');
  }
  fillTiles();
}

window.onload = fillTiles;
