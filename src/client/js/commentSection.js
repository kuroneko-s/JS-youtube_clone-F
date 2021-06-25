const videoContrainer = document.getElementById("videoContrainer");
const form = document.getElementById("commentForm");
const removeBtn = document.querySelectorAll(".video__comment-remove");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  icon.className = "fas fa-comment";
  span.className = "video__comment-text";
  span.innerText = text;
  span2.className = "video__comment-remove";
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);

  // 새로만든 얘는 eventLisener이 없어서 별도로 이벤트 추가
  const removeBtn = document.querySelector(".video__comment-remove");
  removeBtn.addEventListener("click", handleRemove);
};

const handleSubmit = async (event) => {
  const textarea = form.querySelector("textarea");
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContrainer.dataset.id;
  if (text === "") return;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/JSON",
    },
  });
  const { commentId } = await response.json();
  textarea.value = "";
  if (response.status === 201) {
    addComment(text, commentId);
  }
};

const handleRemove = async (e) => {
  //e.target.parentElement
  const li = e.target.parentElement;
  const { id } = li.dataset;
  // html에서 삭제
  console.log(li);
  li.remove();
  // fetch 써서 해당 댓글 삭제
  await fetch(`/api/comment/${id}`, {
    method: "DELETE",
  });
};

form != null && form.addEventListener("submit", handleSubmit);
if (removeBtn != null) {
  removeBtn.forEach((btn) => btn.addEventListener("click", handleRemove));
}
