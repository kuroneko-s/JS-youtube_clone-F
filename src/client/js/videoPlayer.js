const { default: fetch } = require("node-fetch");

const html = document.querySelector("html");
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContrainer = document.getElementById("videoContrainer");
const videoControls = document.getElementById("videoControls");

let controlersTimeout = null;
let controlersMovementTimeout = null;
let volumeValue = 0.5;
const MaxVolume = 1;
video.volume = volumeValue;

const formatTime = (second) =>
  new Date(second * 1000).toISOString().substr(14, 5);

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }

  playIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }

  if (video.muted) {
    muteIcon.className = "fas fa-volume-mute";
    volumeRange.value = 0;
  } else {
    muteIcon.className =
      MaxVolume / 2 <= volumeValue ? "fas fa-volume-up" : "fas fa-volume-down";
    volumeRange.value = volumeValue;
  }
};

const handleVolumneChange = (e) => {
  const {
    target: { value },
  } = e;

  if (video.muted) {
    video.muted = false;
    muteIcon.className = "fas fa-volume-mute";
  }

  volumeValue = value;
  video.value = value;
  muteIcon.className =
    MaxVolume / 2 <= volumeValue ? "fas fa-volume-up" : "fas fa-volume-down";
};

const handleTimelineChange = (e) => {
  const {
    target: { value },
  } = e;
  video.currentTime = value;
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  // video duration is second
  timeline.max = Math.floor(video.duration);
};

const handleTimeupdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

//keypress is f
const handleFullscreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    video.classList.remove("fullscreen");
    fullScreenIcon.className = "fas fa-expand";
  } else {
    video.classList.add("fullscreen");
    videoContrainer.requestFullscreen();
    fullScreenIcon.className = "fas fa-compress";
  }
};

const handleMouseMove = () => {
  if (controlersTimeout) {
    clearTimeout(controlersTimeout);
    controlersTimeout = null;
  }
  if (controlersMovementTimeout) {
    clearTimeout(controlersMovementTimeout);
    controlersMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlersMovementTimeout = setTimeout(removeShowing, 3000);
};

const handleMouseLeave = () => {
  controlersTimeout = setTimeout(removeShowing, 3000);
};

const removeShowing = () => {
  videoControls.classList.remove("showing");
};

const handleEnded = (e) => {
  // RegExp 사용했을때
  // const id = rege.exec(window.location.pathname)[0];
  const { id } = videoContrainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const handleKeydown = (e) => {
  if (e.keyCode === 32) {
    e.preventDefault();
    handlePlayClick();
  } else if (e.keyCode === 70) {
    e.preventDefault();
    handleFullscreen();
  }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumneChange);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeupdate);
video.addEventListener("ended", handleEnded);
video.addEventListener("click", handlePlayClick);
videoContrainer.addEventListener("mousemove", handleMouseMove);
videoContrainer.addEventListener("mouseleave", handleMouseLeave);
html.addEventListener("keydown", handleKeydown);
