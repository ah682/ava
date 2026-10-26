var before = document.getElementById("before");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");
var git = 0;
var commands = [];

// Keep ordinary navigation and the user's initial focus intact.
setTimeout(function () { loopLines(banner, "", 80); }, 100);
textarea.value = "";
command.textContent = "";
textarea.addEventListener("input", function () { typeIt(textarea); });
textarea.addEventListener("keydown", enterKey);
document.getElementById("command").addEventListener("click", function (event) {
  if (!event.target.closest("a, button, input, textarea, label, select")) textarea.focus();
});

function enterKey(event) {
  if (event.target !== textarea || event.isComposing) return;
  var key = event.key || { 13: "Enter", 38: "ArrowUp", 40: "ArrowDown" }[event.keyCode];
  if (key === "Enter") {
    event.preventDefault();
    var value = textarea.value;
    commands.push(value);
    git = commands.length;
    addTextLine("ava@ah682:~/portfolio (main)$ " + value, "no-animation", 0);
    commander(value.trim().toLowerCase());
    textarea.value = "";
    typeIt(textarea);
  } else if (key === "ArrowUp" || key === "ArrowDown") {
    if (!commands.length) return;
    event.preventDefault();
    if (key === "ArrowUp") git = Math.max(0, git - 1);
    else git = Math.min(commands.length, git + 1);
    textarea.value = commands[git] || "";
    typeIt(textarea);
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  } else {
    moveIt(textarea.value.length, event);
  }
}

function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case "help": loopLines(help, "color2 margin", 80); break;
    case "about":
    case "aboutme": loopLines(aboutme, "color2 margin", 80); break;
    case "projects": loopLines(projects, "color2 margin", 80); break;
    case "contact": loopLines(contact, "color2 margin", 80); break;
    case "history":
      commands.forEach(function (value, index) { addTextLine(value, "color2", index * 80); });
      break;
    case "clear":
      terminal.replaceChildren(document.createElement("span"));
      before = terminal.firstChild;
      before.id = "before";
      loopLines(banner, "", 80);
      break;
    case "banner": loopLines(banner, "", 80); break;
    default:
      addLine('Command not found. For a list of commands, type <span class="command">help</span>.', "error", 100);
  }
}

function appendLine(value, style, time, plainText) {
  setTimeout(function () {
    var next = document.createElement("p");
    // HTML is reserved for author-controlled command descriptions. User input
    // always goes through the text path, including output and saved history.
    if (plainText) next.textContent = value;
    else next.innerHTML = value;
    next.className = style;
    before.parentNode.insertBefore(next, before);
    if (document.activeElement === textarea) window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

function addTextLine(value, style, time) { appendLine(value, style, time, true); }
function addLine(markup, style, time) { appendLine(markup, style, time, false); }
function loopLines(lines, style, time) {
  lines.forEach(function (item, index) { addLine(item, style, index * time); });
}
