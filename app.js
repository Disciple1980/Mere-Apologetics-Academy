const exercise = {
  id: "kalam-001",
  title: "Kalam Cosmological Argument",
  argument: "Everything that begins to exist has a cause.\nThe universe began to exist.\nTherefore, the universe has a cause.",
  instructions: [
    "Identify the conclusion.",
    "Identify the explicit premises.",
    "Reconstruct the argument in numbered form.",
    "Explain whether the conclusion follows from the premises.",
    "Distinguish validity from soundness.",
    "Identify which premise would require further justification and what kind of evidence would be relevant."
  ]
};

let attempts = Number(localStorage.getItem("maa_attempts") || 0);

function esc(value) {
  return String(value ?? "").replace(/[&<>\"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#039;"
  }[ch]));
}

function render() {
  document.getElementById("app").innerHTML = `
    <div class="app">
      <header class="top">
        <div class="brand">Mere Apologetics Academy</div>
        <div class="title">Train your mind.</div>
        <div class="subtitle">Reason carefully. Defend thoughtfully.</div>
      </header>

      <main class="content">
        <section id="home" class="screen on">
          <div class="card hero">
            <div class="eyebrow">Argument Reconstruction · Exercise 1</div>
            <div class="h2">${exercise.title}</div>
            <p class="hero-text">Reconstruct the argument, evaluate its logic, and defend your assessment. The AI Professor evaluates your reasoning rather than matching keywords.</p>
            <button class="btn" onclick="beginExercise()">Begin Training</button>
          </div>

          <div class="card">
            <div class="h3">The Academy method</div>
            <div class="method">Understand → Reconstruct → Evaluate → Steelman → Respond → Revise</div>
            <div class="criteria">
              <div class="crit"><b>Structure</b><span>Premises & conclusion</span></div>
              <div class="crit"><b>Logic</b><span>Inference & validity</span></div>
              <div class="crit"><b>Qualification</b><span>Careful claims</span></div>
              <div class="crit"><b>Explanation</b><span>Reasons & evidence</span></div>
            </div>
          </div>
        </section>

        <section id="exercise" class="screen">
          <button class="btn outline" onclick="showScreen('home')">← Academy Home</button>
          <div class="card">
            <div class="eyebrow">Exercise 1 · Attempt <span id="attemptLabel">${attempts + 1}</span></div>
            <div class="h2">${exercise.title}</div>
            <p class="task">Reconstruct the argument before defending or criticizing it.</p>
            <div class="quote">${esc(exercise.argument)}</div>
            <p class="task"><b>Your task</b></p>
            <ol class="instructions">${exercise.instructions.map(item => `<li>${esc(item)}</li>`).join("")}</ol>
          </div>

          <div class="card">
            <div class="h3">Your response</div>
            <textarea id="answer" placeholder="Write your reconstruction and evaluation here..." spellcheck="true"></textarea>
            <button id="submitBtn" class="btn" onclick="submitAnswer()">Submit to Professor</button>
            <p class="small">The Professor will read the substance of your answer and may ask a Socratic follow-up question.</p>
          </div>

          <div id="feedback" class="card feedback"></div>
        </section>

        <section id="complete" class="screen">
          <div class="card hero">
            <div class="eyebrow">Training record</div>
            <div class="h2">Exercise complete</div>
            <p class="hero-text">You have completed this reconstruction. The next exercise will increase the difficulty by focusing on implicit premises.</p>
          </div>
          <div class="card">
            <div class="h3">Keep training</div>
            <p class="small">Return to Exercise 1 to practice again and compare how your reconstruction changes.</p>
            <button class="btn" onclick="restartExercise()">Practice Again</button>
          </div>
        </section>
      </main>
    </div>`;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("on"));
  document.getElementById(id).classList.add("on");
}

function beginExercise() {
  showScreen("exercise");
  setTimeout(() => document.getElementById("answer")?.focus(), 50);
}

function restartExercise() {
  showScreen("exercise");
  document.getElementById("answer").value = "";
  document.getElementById("feedback").className = "card feedback";
  document.getElementById("attemptLabel").textContent = attempts + 1;
}

function focusAnswer() {
  document.getElementById("answer")?.focus();
}

function scoreClass(score) {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good-score";
  if (score >= 60) return "developing-score";
  return "revision-score";
}

function label(value) {
  return ({strong:"Strong", competent:"Competent", developing:"Developing", needs_revision:"Needs revision"})[value] || value || "—";
}

function renderFeedback(data) {
  const feedback = document.getElementById("feedback");
  const score = Math.max(0, Math.min(100, Number(data.score) || 0));
  feedback.className = "card feedback show";
  feedback.innerHTML = `
    <div class="eyebrow">Professor's assessment · Attempt ${attempts}</div>
    <div class="assessment-head">
      <div class="h2">${esc(data.headline || "Assessment")}</div>
      <div class="score ${scoreClass(score)}">${score}/100</div>
    </div>
    <div class="${data.needs_revision ? "hint" : "good"}">
      <b>${data.needs_revision ? "Socratic feedback" : "What you did well"}</b>
      <div>${esc(data.feedback || "")}</div>
    </div>
    ${data.socratic_question ? `<div class="question"><div class="h3">Professor's question</div><p>${esc(data.socratic_question)}</p></div>` : ""}
    <div class="criteria rubric">
      ${["Structure","Logic","Qualification","Explanation"].map((name, i) => {
        const key = ["structure","logic","qualification","explanation"][i];
        return `<div class="crit"><b>${name}</b><span>${esc(label(data.rubric?.[key]))}</span></div>`;
      }).join("")}
    </div>
    ${data.reference_analysis ? `<details><summary><b>Reference analysis</b></summary><div class="quote reference">${esc(data.reference_analysis)}</div></details>` : ""}
    ${data.next_step ? `<p class="next"><b>Next step:</b> ${esc(data.next_step)}</p>` : ""}
    <button class="btn" onclick="${data.needs_revision ? "focusAnswer()" : "completeExercise()"}">${data.needs_revision ? "Revise Answer" : "Continue"}</button>
    <button class="btn light" onclick="focusAnswer()">Revise Again</button>`;
  feedback.scrollIntoView({behavior:"smooth", block:"start"});
}

function completeExercise() {
  showScreen("complete");
}

async function submitAnswer() {
  const answer = document.getElementById("answer").value.trim();
  if (answer.length < 40) {
    alert("Give the Professor enough reasoning to evaluate your response. Aim for at least a short paragraph.");
    return;
  }

  const btn = document.getElementById("submitBtn");
  const feedback = document.getElementById("feedback");
  btn.disabled = true;
  btn.textContent = "Professor is reading…";
  feedback.className = "card feedback show";
  feedback.innerHTML = `<div class="loading"><div class="spinner"></div><b>The Professor is analyzing your reasoning.</b><div class="small">Checking structure, logic, qualification, and justification.</div></div>`;
  feedback.scrollIntoView({behavior:"smooth", block:"start"});

  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ exercise, answer, attempt: attempts + 1 })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The Professor could not evaluate this response.");
    attempts += 1;
    localStorage.setItem("maa_attempts", String(attempts));
    renderFeedback(data);
  } catch (error) {
    feedback.innerHTML = `
      <div class="eyebrow">Professor unavailable</div>
      <div class="h2">The exercise itself is working.</div>
      <div class="warn">${esc(error.message)}</div>
      <p class="small">If this is your first deployment, the usual remaining step is adding <b>OPENAI_API_KEY</b> to Vercel's Environment Variables and redeploying. Never put the key in this browser code.</p>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit to Professor";
  }
}

render();
