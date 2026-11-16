(() => {
  const expressionEl = document.querySelector("#expression");
  const resultEl = document.querySelector("#result");
  const historyEl = document.querySelector("#history-list");
  const clearHistoryButton = document.querySelector("#clear-history");

  let expression = "";
  let justCalculated = false;
  const history = [];

  const pretty = value => value.replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−");

  function tokenize(input) {
    const tokens = [];
    let i = 0;
    while (i < input.length) {
      if (/\s/.test(input[i])) { i++; continue; }
      const rest = input.slice(i);
      const number = rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
      if (number) { tokens.push({type:"number", value:Number(number[0])}); i += number[0].length; continue; }
      if ("+-*/()".includes(input[i])) { tokens.push({type:input[i], value:input[i]}); i++; continue; }
      throw new Error("Invalid character");
    }
    return tokens;
  }

  function calculate(input) {
    const tokens = tokenize(input);
    let pos = 0;
    const peek = () => tokens[pos];
    const take = type => {
      if (!peek() || peek().type !== type) throw new Error("Invalid expression");
      return tokens[pos++];
    };
    function primary() {
      if (peek()?.type === "+") { take("+"); return primary(); }
      if (peek()?.type === "-") { take("-"); return -primary(); }
      if (peek()?.type === "number") return take("number").value;
      if (peek()?.type === "(") {
        take("("); const value = sum(); take(")"); return value;
      }
      throw new Error("Expected a number");
    }
    function product() {
      let value = primary();
      while (peek()?.type === "*" || peek()?.type === "/") {
        const op = tokens[pos++].type;
        const right = primary();
        if (op === "/" && right === 0) throw new Error("Cannot divide by zero");
        value = op === "*" ? value * right : value / right;
      }
      return value;
    }
    function sum() {
      let value = product();
      while (peek()?.type === "+" || peek()?.type === "-") {
        const op = tokens[pos++].type;
        const right = product();
        value = op === "+" ? value + right : value - right;
      }
      return value;
    }
    if (!tokens.length) return 0;
    const answer = sum();
    if (pos !== tokens.length || !Number.isFinite(answer)) throw new Error("Invalid result");
    return Number.parseFloat(answer.toPrecision(12));
  }

  function format(value) {
    return new Intl.NumberFormat("en-US", {maximumFractionDigits:10}).format(value);
  }

  function render() {
    expressionEl.textContent = expression ? pretty(expression) : "\u00a0";
    if (!expression) { resultEl.textContent = "0"; return; }
    try { resultEl.textContent = format(calculate(expression)); }
    catch { resultEl.textContent = "…"; }
  }

  function addHistory(expr, value) {
    history.unshift({expr, value});
    if (history.length > 6) history.pop();
    historyEl.replaceChildren();
    history.forEach(item => {
      const li = document.createElement("li");
      const left = document.createElement("span");
      const right = document.createElement("span");
      left.className = "history-expression";
      right.className = "history-result";
      left.textContent = pretty(item.expr) + " =";
      right.textContent = format(item.value);
      li.append(left, right);
      historyEl.append(li);
    });
  }

  function append(value) {
    if (justCalculated && /[0-9.]/.test(value)) expression = "";
    justCalculated = false;
    if (/[+*/-]/.test(value) && expression === "" && value !== "-") return;
    if (/[+*/-]/.test(value) && /[+*/-]$/.test(expression)) expression = expression.slice(0,-1);
    if (value === "." && /(?:^|[+*/(-])\d*\.\d*$/.test(expression)) return;
    expression += value;
    render();
  }

  function equals() {
    if (!expression) return;
    try {
      const original = expression;
      const answer = calculate(expression);
      addHistory(original, answer);
      expression = String(answer);
      justCalculated = true;
      expressionEl.textContent = pretty(original) + " =";
      resultEl.textContent = format(answer);
    } catch (error) {
      resultEl.textContent = error.message === "Cannot divide by zero" ? "Cannot divide by 0" : "Error";
    }
  }

  function handleAction(action) {
    if (action === "clear") { expression = ""; justCalculated = false; render(); }
    if (action === "backspace") { expression = expression.slice(0,-1); justCalculated = false; render(); }
    if (action === "equals") equals();
    if (action === "sign") {
      if (!expression) expression = "-";
      else if (/\d+(?:\.\d*)?$/.test(expression)) {
        const match = expression.match(/\d+(?:\.\d*)?$/)[0];
        const start = expression.length - match.length;
        const before = expression.slice(0,start);
        expression = before.endsWith("(-") ? before.slice(0,-2) + match : before + "(-" + match + ")";
      }
      justCalculated = false; render();
    }
    if (action === "percent" && expression) {
      try { expression = String(calculate(expression) / 100); justCalculated = false; render(); } catch {}
    }
  }

  document.querySelector(".keypad").addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.action) handleAction(button.dataset.action);
    else if (button.dataset.value) append(button.dataset.value);
  });

  document.addEventListener("keydown", event => {
    if (/^[0-9.]$/.test(event.key)) append(event.key);
    else if (["+", "-", "*", "/"].includes(event.key)) append(event.key);
    else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); equals(); }
    else if (event.key === "Backspace") handleAction("backspace");
    else if (event.key === "Escape" || event.key === "Delete") handleAction("clear");
    else if (event.key === "%") handleAction("percent");
  });

  clearHistoryButton.addEventListener("click", () => {
    history.length = 0;
    historyEl.innerHTML = '<li class="empty-history">Your calculations will show up here.</li>';
  });

  render();
})();