const startBtn = document.getElementById("startBtn");
const preview = document.getElementById("preview");

const constraints = { video: { width: 200, height: 100 }, audio: false };
let stream = null;
let recorder = null;
let videoUrl = null;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoUrl;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    // 브라우저 메모리에서만 접근 가능한 URL을 만들어줌
    videoUrl = URL.createObjectURL(event.data);

    preview.srcObject = null;
    preview.src = videoUrl;
    preview.loop = true;
    preview.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  preview.srcObject = stream;
  preview.play();
};

init();

startBtn.addEventListener("click", handleStart);
