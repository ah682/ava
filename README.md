# Ava's terminal portfolio

My portfolio, built with HTML, CSS and vanilla JavaScript. Browse the project,
about and contact links, or explore through the terminal with commands like
`help`, `aboutme` and `projects`.

## Run locally

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000`. The page uses the checked-in CSS and JavaScript, so
there is no build step.

Click the terminal or tab to its input, then press Enter to run a command. Up and
Down recall previous commands. Use `help` for the command list, `history` to see
what you've entered, and `clear` to start with an empty terminal.

## Development

```bash
npm ci
npm test
```

The tests use Node.js and LinkeDOM to check command output, history, keyboard
handling and project links. They were developed with Node.js 24. After changing
the interface, check keyboard focus and the mobile layout in a browser too.

- `index.html` contains the page sections.
- `js/commands.js` contains the terminal's profile, project and help text.
- `js/main.js` and `js/caret.js` handle terminal input and output. Commands run
  locally in the page.
- `portfolio.css` styles the navigation and profile sections.
- `main.css` is the generated Tailwind stylesheet. The old `npm run dev` script
  refers to a missing `tailwind.css`; serve the existing CSS using the command
  above.

The page uses Google Fonts and Font Awesome. Tailwind's licence notice is included
in `main.css`.
