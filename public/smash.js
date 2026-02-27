let list = [];
let i = 0;
let smash = 0;
let pass = 0;

const pic = document.getElementById("pic");
const idxEl = document.getElementById("idx");
const totalEl = document.getElementById("total");
const sEl = document.getElementById("s");
const pEl = document.getElementById("p");

function shuffle(arr){
  for(let k=arr.length-1;k>0;k--){
    const j=Math.floor(Math.random()*(k+1));
    [arr[k],arr[j]]=[arr[j],arr[k]];
  }
}

async function load(){
  const res = await fetch("/api/images");
  const data = await res.json();
  list = (data.images || []).map(n => "/images/" + encodeURIComponent(n));

  if(list.length === 0){
    document.body.innerHTML += "<h3>images/ folder дотор зураг хийгээрэй!</h3>";
    return;
  }
  shuffle(list);
  i = 0; smash = 0; pass = 0;
  totalEl.textContent = String(list.length);
  render();
}

function render(){
  idxEl.textContent = String(Math.min(i+1, list.length));
  sEl.textContent = String(smash);
  pEl.textContent = String(pass);

  if(i >= list.length){
    pic.style.display = "none";
    document.body.innerHTML += `<h2>Дууслаа ✅ Smash=${smash} | Pass=${pass}</h2>`;
    return;
  }
  pic.style.display = "";
  pic.src = list[i];
}

document.getElementById("smashBtn").onclick = () => { smash++; i++; render(); };
document.getElementById("passBtn").onclick  = () => { pass++; i++; render(); };
document.getElementById("skipBtn").onclick  = () => { i++; render(); };
document.getElementById("shuffleBtn").onclick = () => { shuffle(list); i=0; render(); };

load();