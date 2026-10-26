# Ava's terminal portfolio

A personal, terminal-style portfolio for Ava (`ah682`), built with HTML, CSS and
vanilla JavaScript. The existing ASCII name, translucent terminal chrome, backdrop
and command history remain. Ordinary Projects, About and Contact links provide a
readable route to the same profile without needing to discover a terminal command.

Selected project links point to RiskReplay, NoticeForge, Complexity Profiler,
Commission Dashboard and Cute Calculator repositories. Contact links to the existing
GitHub profile; the page has no message-submission service.

## Run locally

The checked-in CSS and scripts can be served directly; no npm build is required:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000`. `CNAME` names `avaonline.me`, but a CNAME file alone
does not verify current DNS or live hosting.

Click the labelled terminal area, or tab to its input, and type `help`, `aboutme`,
`projects`, `contact`, `history`, `clear` or `banner`. Enter runs a command; Up/Down
recall earlier commands. These handlers belong to the input, so ordinary links keep
their browser keyboard behavior. Typed commands and history are rendered as text;
HTML markup is reserved for the repository's own help/project descriptions.

## Development and verification

```bash
npm ci
npm test
node --check js/main.js
node --check js/caret.js
node --check js/commands.js
```

The Node test runner and LinkeDOM exercise literal command rendering, history,
input-only keyboard handling, composition input and valid project destinations.
This checks DOM behavior, not real-browser layout or assistive-technology support;
check visible keyboard focus, link activation and narrow-screen layout in a browser
after UI changes. Tests were developed with Node.js 24; serving the page needs no Node.

`main.css` is the existing generated Tailwind stylesheet. New navigation styles live
in `portfolio.css`. The legacy `npm run dev` references a missing `tailwind.css`
input, so it is not the local serving command; restoring the CSS generation pipeline
is separate maintenance work.

## Provenance and limits

This is a personal frontend project, not a shell or server administration console.
Terminal commands do not execute system commands. Project descriptions link to their
repositories and should be reviewed there for current evidence and limitations.

The page loads Google Fonts and a Font Awesome kit; those requests and their terms
are external to this repository. Preserve Tailwind's existing licence notice in the
stylesheet and review backdrop/font/icon provenance before reuse. Existing package
licence metadata is unchanged; this README grants no new rights to third-party assets.
