let target = document.querySelector(".full-screen");
function openFullImage() {
  target.classList.add("active");
  document.body.style.overflowY = "hidden";
}
function closeFullImage() {
  target.classList.remove("active");
  document.body.style.overflowY = "auto";
}
