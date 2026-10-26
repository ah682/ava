const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { parseHTML } = require('linkedom');

function terminal() {
  const { window, document } = parseHTML(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'));
  const scheduled = [];
  window.scrollTo = () => {};
  const context = vm.createContext({
    window, document, console,
    setTimeout(callback) { scheduled.push(callback); },
  });
  for (const name of ['caret.js', 'commands.js', 'main.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', name), 'utf8'), context);
  }
  if (context.init) context.init();
  const flush = () => { while (scheduled.length) scheduled.shift()(); };
  flush();
  const input = document.getElementById('texter');
  // LinkeDOM models markup/events, but not native input selection methods.
  input.setSelectionRange = function (start, end) { this.selectionStart = start; this.selectionEnd = end; };
  const mirror = document.getElementById('typer');
  const output = document.getElementById('terminal');
  function key(value, extra = {}) {
    const keyCode = { Enter: 13, ArrowUp: 38, ArrowDown: 40 }[value];
    context.enterKey({ key: value, keyCode, target: input, preventDefault() {}, ...extra });
    flush();
  }
  function type(value) { input.value = value; context.typeIt(input, {}); }
  return { context, document, input, mirror, output, type, key, flush };
}

const hostile = '<img src=x onerror="globalThis.injected=true">';

test('input mirror displays command markup literally', () => {
  const ui = terminal();
  ui.type(hostile);
  assert.equal(ui.mirror.textContent, hostile);
  assert.equal(ui.mirror.querySelector('img'), null);
});

test('submitted command remains literal text in output', () => {
  const ui = terminal();
  ui.type(hostile);
  ui.key('Enter');
  assert.ok(ui.output.textContent.includes(hostile));
  assert.equal(ui.output.querySelector('img'), null);
  assert.equal(ui.input.value, '');
});

test('history never interprets a previous command as HTML', () => {
  const ui = terminal();
  ui.type(hostile);
  ui.key('Enter');
  ui.type('history');
  ui.key('Enter');
  const history = [...ui.output.querySelectorAll('p.color2')].map(node => node.textContent);
  assert.ok(history.includes(hostile));
  assert.equal(ui.output.querySelector('img'), null);
});

test('Enter from a navigation link does not submit the command input', () => {
  const ui = terminal();
  ui.type('help');
  const before = ui.output.textContent;
  ui.key('Enter', { target: ui.document.querySelector('a') });
  assert.equal(ui.output.textContent, before);
  assert.equal(ui.input.value, 'help');
});

test('composition Enter does not submit a partially composed command', () => {
  const ui = terminal();
  ui.type('projects');
  const before = ui.output.textContent;
  ui.key('Enter', { isComposing: true });
  assert.equal(ui.output.textContent, before);
  assert.equal(ui.input.value, 'projects');
});

test('history arrows recall commands and return to a blank input', () => {
  const ui = terminal();
  for (const command of ['aboutme', 'projects']) { ui.type(command); ui.key('Enter'); }
  ui.key('ArrowUp'); assert.equal(ui.input.value, 'projects');
  ui.key('ArrowUp'); assert.equal(ui.input.value, 'aboutme');
  ui.key('ArrowDown'); assert.equal(ui.input.value, 'projects');
  ui.key('ArrowDown'); assert.equal(ui.input.value, '');
  assert.equal(ui.mirror.textContent, '');
});

test('author project links retain usable destinations', () => {
  const ui = terminal();
  ui.context.commander('projects'); ui.flush();
  const links = [...ui.output.querySelectorAll('a[href]')];
  assert.ok(links.some(link => link.getAttribute('href') === 'https://github.com/ah682/complexity-profiler'));
  for (const link of links) assert.doesNotMatch(link.getAttribute('href'), /["<>\s]/);
});

test('direct navigation reaches readable content without running commands', () => {
  const { document } = parseHTML(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'));
  for (const [name, id] of [['Projects', 'projects'], ['About', 'about'], ['Contact', 'contact']]) {
    const link = [...document.querySelectorAll('nav a')].find(link => link.textContent.trim() === name);
    assert.ok(link, `${name} is a visible navigation link`);
    assert.equal(link.getAttribute('href'), '#' + id);
    assert.ok(document.getElementById(id).textContent.trim());
  }
});

test('history keys keep the current draft when no command has been submitted', () => {
  const ui = terminal();
  ui.type('unfinished draft');
  ui.key('ArrowUp');
  assert.equal(ui.input.value, 'unfinished draft');
  ui.key('ArrowDown');
  assert.equal(ui.input.value, 'unfinished draft');
});
