import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const preview = document.getElementById("preview");

let stream = null;
let recorder = null;
let videoUrl = null;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "/core/ffmpeg-core.js",
  });
  //step 1
  await ffmpeg.load();
  //step 2 creating and download and change
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoUrl));
  // 초당 60프레임 인코딩
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();

  // 브라우저 메모리상에 존재하는 파일들을 삭제
  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  // 브라우저 상에서 데이터를 URL화 한 파일들 ( 링크 ) 삭제
  URL.revokeObjectURL(videoUrl);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
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
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    preview.srcObject = stream;
    preview.play();
  } catch (e) {
    console.error(e);
  }
};

init();

startBtn.addEventListener("click", handleStart);
