import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const preview = document.getElementById("preview");
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

let stream = null;
let recorder = null;
let videoUrl = null;

const downloadFile = (fileUrl, filename) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "/core/ffmpeg-core.js",
  });

  //step 1
  await ffmpeg.load();
  //step 2 creating and download and change
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoUrl));
  // 초당 60프레임 인코딩
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  // 브라우저 메모리상에 존재하는 파일들을 삭제
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  // 브라우저 상에서 데이터를 URL화 한 파일들 ( 링크 ) 삭제
  URL.revokeObjectURL(videoUrl);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);

  actionBtn.disabled = false;
  actionBtn.innerText = "Recored Agin";
  actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  init();

  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

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
      video: { height: 480, width: 720 },
      audio: false,
    });
    preview.srcObject = stream;
    preview.play();
  } catch (e) {
    console.error(e);
  }
};

init();

actionBtn.addEventListener("click", handleStart);
