# Calculator

A clean, responsive calculator for everyday maths — built with **HTML, CSS and vanilla JavaScript**.

I wanted to make a small project that feels simple to use but still has the details that make a tool enjoyable: a clear display, a tidy layout, keyboard controls and a recent-calculations panel.

## ✨ Live demo

**[Open the calculator](https://inzohaib.github.io/calculator/)**

## Features

- **Basic arithmetic** — addition, subtraction, multiplication and division.
- **Useful controls** — percentages, positive/negative toggle, decimals, clear and backspace.
- **Live preview** — see the result update as you type.
- **Calculation history** — keep track of your latest six calculations.
- **Keyboard support** — enter numbers and operators from your keyboard; use Enter to calculate, Backspace to delete and Escape to clear.
- **Responsive interface** — works on desktop, tablet and mobile.
- **No dependencies** — built with browser-native technologies and no build step.

## Built with

- HTML5 for structure
- CSS3 for the responsive dark interface
- Vanilla JavaScript for calculator logic and interaction
- GitHub Actions + GitHub Pages for deployment

## Run locally

1. Clone this repository:
   `git clone https://github.com/inzohaib/calculator.git`
2. Open the project folder.
3. Start a local server (optional, but recommended):
   `python3 -m http.server 8000`
4. Visit `http://localhost:8000` in your browser.

You can also open `index.html` directly.

## Project structure

```
calculator/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── index.html
├── style.css
├── script.js
└── README.md
```

## What I learned

This project was a fun way to practise DOM interaction, event handling, responsive CSS and writing calculator logic without relying on `eval()` or external libraries.

---

Made with curiosity by [Zohaib](https://github.com/inzohaib).
