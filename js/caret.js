var cursor;
function init() {
  cursor = document.getElementById("cursor");
  cursor.style.left = "0px";
}
init();

function typeIt(input) {
  document.getElementById("typer").textContent = input.value.replace(/\n/g, "");
  cursor.style.left = "0px";
}

function moveIt(count, event) {
  var code = event.keyCode || event.which;
  if ((event.key === "ArrowLeft" || code === 37) && parseInt(cursor.style.left) >= -(count - 1) * 10) {
    cursor.style.left = parseInt(cursor.style.left) - 10 + "px";
  } else if ((event.key === "ArrowRight" || code === 39) && parseInt(cursor.style.left) + 10 <= 0) {
    cursor.style.left = parseInt(cursor.style.left) + 10 + "px";
  }
}
