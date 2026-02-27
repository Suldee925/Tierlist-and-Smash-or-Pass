const TIERS = [
  { key:"S", color:"#ff4d4d" },
  { key:"A", color:"#ff944d" },
  { key:"B", color:"#ffd24d" },
  { key:"C", color:"#b3ff66" },
  { key:"D", color:"#66ccff" },
  { key:"F", color:"#999999" },
];

const pool = document.getElementById("pool");
const tiersEl = document.getElementById("tiers");
const cntEl = document.getElementById("cnt");

function makeDropZone(el){
  el.ondragover = (e)=>e.preventDefault();
  el.ondrop = (e)=>{
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    const node = document.getElementById(id);
    if(node) el.appendChild(node);
  };
}

function makeThumb(src){
  const img = document.createElement("img");
  img.src = src;
  img.className = "thumb";
  img.id = "img_" + Math.random().toString(16).slice(2);
  img.draggable = true;
  img.ondragstart = (e)=> e.dataTransfer.setData("id", img.id);
  return img;
}

function buildTiers(){
  tiersEl.innerHTML = "";
  TIERS.forEach(t=>{
    const row = document.createElement("div");
    row.className = "row";

    const label = document.createElement("div");
    label.className = "label";
    label.style.background = t.color;
    label.textContent = t.key;

    const drop = document.createElement("div");
    drop.className = "drop";
    drop.dataset.tier = t.key;
    makeDropZone(drop);

    row.appendChild(label);
    row.appendChild(drop);
    tiersEl.appendChild(row);
  });
}

async function loadImages(){
  const res = await fetch("/api/images");
  const data = await res.json();
  const list = (data.images||[]).map(n => "/images/" + encodeURIComponent(n));
  cntEl.textContent = String(list.length);
  return list;
}

async function init(){
  makeDropZone(pool);
  buildTiers();
  const imgs = await loadImages();
  pool.innerHTML = "";
  imgs.forEach(src=> pool.appendChild(makeThumb(src)));
}

document.getElementById("resetBtn").onclick = init;

document.getElementById("exportBtn").onclick = ()=>{
  const out = {};
  out.pool = [...pool.querySelectorAll("img")].map(i=>i.src);

  TIERS.forEach(t=>{
    const zone = tiersEl.querySelector(`.drop[data-tier="${t.key}"]`);
    out[t.key] = [...zone.querySelectorAll("img")].map(i=>i.src);
  });

  const blob = new Blob([JSON.stringify(out, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tierlist.json";
  a.click();
};

init();