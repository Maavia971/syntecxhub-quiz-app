// ===== Data =====
const quizData = {
  html: [
    { question: "HTML stands for?", options: ["Hyper Text Markup Language","Hot Mail","How To Make"], answer: 0 },
    { question: "The <p> tag defines?", options: ["Paragraph","Picture","Panel"], answer: 0 }
  ],
  css: [
    { question: "CSS stands for?", options: ["Cascading Style Sheets","Creative Style Sheets","Computer Style Sheets"], answer: 0 },
    { question: "Property that changes text color?", options: ["color","background","font-size"], answer: 0 }
  ],
  js: [
    { question: "Which language is used for frontend logic?", options: ["JavaScript","Python","PHP"], answer: 0 },
    { question: "Symbol for comments in JS?", options: ["//","/* */","#"], answer: 0 }
  ]
};

// ===== Elements =====
const categorySection = document.getElementById('category-selection');
const categoryBtns = document.querySelectorAll('.category-btn');
const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const themeToggle = document.getElementById('theme-toggle');
const confettiCanvas = document.getElementById('confetti-canvas');

let selectedCategory = null;
let questions = [];
let currentIndex = 0;
let score = 0;

// ===== Functions =====
function startQuiz(category){
  selectedCategory = category;
  questions = [...quizData[category]].sort(() => Math.random() - 0.5);
  categorySection.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  currentIndex = 0; score = 0;
  loadQuestion();
}

function loadQuestion(){
  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  nextBtn.disabled = true;

  q.options.forEach((opt,i)=>{
    const li = document.createElement('li');
    li.textContent = opt;
    li.addEventListener('click',()=>selectOption(i));
    optionsEl.appendChild(li);
  });

  updateProgress();
}

function selectOption(selectedIndex){
  const correctIndex = questions[currentIndex].answer;
  if(selectedIndex === correctIndex) score++;

  Array.from(optionsEl.children).forEach((li,i)=>{
    li.style.pointerEvents='none';
    if(i===correctIndex) li.style.backgroundColor='green';
    else if(i===selectedIndex) li.style.backgroundColor='red';
  });

  nextBtn.disabled=false;
}

function updateProgress(){ progressBar.style.width = `${((currentIndex+1)/questions.length)*100}%`; }

nextBtn.addEventListener('click',()=>{
  currentIndex++;
  if(currentIndex<questions.length) loadQuestion();
  else showResult();
});

// ===== Show Result with Gamification =====
function showResult(){
  quizContainer.innerHTML=`
    <h2>Your Score: ${score} / ${questions.length}</h2>
    <p>${score===questions.length?'🎉 Perfect Score!':score>=questions.length/2?'Good Job!':'Keep Practicing!'}</p>
    <button onclick="location.reload()">Retry Quiz</button>
  `;
  if(score===questions.length) startConfetti();
}

// ===== Category Buttons =====
categoryBtns.forEach(btn=>btn.addEventListener('click',()=>startQuiz(btn.dataset.category)));

// ===== Theme Toggle =====
themeToggle.addEventListener('click',()=>{
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode')?'light':'dark');
});

// ===== Load Theme =====
if(localStorage.getItem('theme')==='light') document.body.classList.add('light-mode');

// ===== Confetti =====
function startConfetti(){
  if(!confettiCanvas) return;
  const confetti = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const pieces = [];
  for(let i=0;i<150;i++){
    pieces.push({x:Math.random()*confettiCanvas.width,y:Math.random()*confettiCanvas.height,r:Math.random()*6+2,d:Math.random()*100,dx:(Math.random()*4)-2,dy:(Math.random()*4)+1});
  }
  function draw(){
    confetti.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    pieces.forEach(p=>{
      confetti.beginPath();
      confetti.arc(p.x,p.y,p.r,0,2*Math.PI);
      confetti.fillStyle=`hsl(${Math.random()*360},100%,50%)`;
      confetti.fill();
      p.x+=p.dx; p.y+=p.dy;
      if(p.y>confettiCanvas.height){ p.y=0; p.x=Math.random()*confettiCanvas.width; }
    });
    requestAnimationFrame(draw);
  }
  draw();
}