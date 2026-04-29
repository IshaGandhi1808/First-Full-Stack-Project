const toggleText = document.querySelectorAll(".toggleText");
toggleText.forEach((text) => {
  let content = text.previousElementSibling;

  let lineHeight = parseFloat(
    getComputedStyle(text.previousElementSibling).lineHeight,
  );
  let totalHeight = content.scrollHeight;
  let targetLine = parseInt(totalHeight / lineHeight);

  if (targetLine > 3) {
    // if (text.previousElementSibling.innerText.length > 300) {
    text.style.display = "";
  } else {
    text.style.display = "none";
  }
});

function showFunction(text) {
  let content = text.parentElement;

  let myText = content.querySelector(".short-text");

  if (text.classList.contains("more-text")) {
    myText.style.height = myText.scrollHeight + "px";
    text.classList.remove("more-text");
    text.innerText = "Read less";
    return text.classList.add("less-text");
  }

  if (text.classList.contains("less-text")) {
    myText.style.height = "3.7rem";
    text.classList.remove("less-text");
    text.innerText = "Read more...";
    return text.classList.add("more-text");
  }
}
