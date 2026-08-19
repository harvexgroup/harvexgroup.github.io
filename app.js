const KEY="harvex-demo-v1";
const buyers=[
 {name:"Green Valley Resort",type:"Resort",produce:"Leafy Greens",qty:"120 kg/week",price:"₹45/kg",icon:"🏨"},
 {name:"Coastal Kitchen",type:"Restaurant",produce:"Tomatoes",qty:"80 kg/week",price:"₹38/kg",icon:"🍅"},
 {name:"FreshMart Retail",type:"Retailer",produce:"Onions",qty:"300 kg/week",price:"₹32/kg",icon:"🛒"},
 {name:"Sunrise Resort",type:"Resort",produce:"Bananas",qty:"150 kg/week",price:"₹40/kg",icon:"🏨"},
 {name:"Local Harvest Foods",type:"Restaurant",produce:"Chillies",qty:"40 kg/week",price:"₹70/kg",icon:"🌶️"},
 {name:"Goa Fresh Wholesale",type:"Retailer",produce:"Potatoes",qty:"500 kg/week",price:"₹29/kg",icon:"🥔"}
];
let state=JSON.parse(localStorage.getItem(KEY)||"null")||{
 profile:{name:"Farmer Account"},
 listings:[
  {id:1,produce:"Tomatoes",qty:250,price:38,quality:"Grade A",storage:"Need storage",date:"",status:"Listed"},
  {id:2,produce:"Leafy Greens",qty:80,price:45,quality:"Grade A",storage:"Ready to sell",date:"",status:"Matched"}
 ],
 storage:[]
};
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateStats();}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function go(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.go===id));
 render();
 window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
 const btn=e.target.closest("[data-go]"); if(btn) go(btn.dataset.go);
});
function updateStats(){
 document.getElementById("statListings").textContent=state.listings.length;
 document.getElementById("statStored").textContent=state.storage.reduce((a,b)=>a+Number(b.qty||0),0)+" kg";
 document.getElementById("statMatches").textContent=state.listings.filter(x=>x.status==="Matched").length;
}
function renderHome(){
 const el=document.getElementById("demandPreview");
 el.innerHTML=buyers.slice(0,3).map(b=>`<div class="demand"><span class="badge">${b.type}</span><h3>${b.icon} ${b.name}</h3><p>Needs <b>${b.produce}</b></p><div class="qty">${b.qty} • ${b.price}</div></div>`).join("");
}
function renderListings(){
 const el=document.getElementById("listingList");
 if(!state.listings.length){el.innerHTML=`<div class="info-note">No listings yet. Tap <b>+ Add</b> to publish your first produce listing.</div>`;return}
 el.innerHTML=state.listings.map(x=>`<div class="list-card"><div><h3>🌱 ${x.produce}</h3><p>${x.qty} kg • ${x.quality}<br>${x.storage} • ${x.date||"Date not set"}</p><span class="status">${x.status}</span></div><div class="price">₹${x.price}<small>/kg</small></div></div>`).join("");
}
function renderBuyers(filter="All"){
 const el=document.getElementById("buyerList");
 const list=filter==="All"?buyers:buyers.filter(b=>b.type===filter);
 el.innerHTML=list.map(b=>`<div class="list-card"><div><span class="badge">${b.type}</span><h3>${b.icon} ${b.name}</h3><p>Demand: <b>${b.produce}</b><br>Regular requirement: ${b.qty}</p></div><div><div class="price">${b.price}</div><button class="primary small-btn" onclick="matchBuyer('${b.name}')">Match</button></div></div>`).join("");
}
function matchBuyer(name){toast(`Match request sent to ${name}`);state.listings.forEach(x=>{if(x.status==="Listed")x.status="Matched"});save();renderListings();}
function renderStorage(){
 const el=document.getElementById("storageHistory");
 if(!state.storage.length){el.innerHTML="";return}
 el.innerHTML=`<div class="history-title">Storage requests</div>`+state.storage.map(x=>`<div class="history-item">📦 <b>${x.produce}</b> • ${x.qty} kg • ${x.days} days<br><span style="color:#64746a">Status: Request received</span></div>`).join("");
}
function render(){
 updateStats(); renderHome(); renderListings(); renderBuyers(); renderStorage();
 document.getElementById("profileName").textContent=state.profile.name;
}
document.getElementById("produceForm").addEventListener("submit",e=>{
 e.preventDefault();
 state.listings.unshift({
  id:Date.now(),produce:produce.value,qty:Number(qty.value),price:Number(price.value),
  quality:quality.value,storage:storage.value,date:date.value,status:"Listed"
 });
 save(); e.target.reset(); toast("🌾 Produce listed successfully!"); go("listings");
});
document.getElementById("storageForm").addEventListener("submit",e=>{
 e.preventDefault();
 state.storage.unshift({produce:sProduce.value,qty:Number(sQty.value),days:Number(sDays.value)});
 save(); e.target.reset(); toast("📦 Storage request received!"); renderStorage();
});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderBuyers(b.dataset.filter);
}));
document.getElementById("editProfile").addEventListener("click",()=>{
 const n=prompt("Enter farmer name:",state.profile.name);
 if(n&&n.trim()){state.profile.name=n.trim();save();render();toast("Profile updated");}
});
document.getElementById("languageBtn").addEventListener("click",()=>toast("🌐 Local-language assisted mode can be added in the production version."));
document.getElementById("clearData").addEventListener("click",()=>{
 if(confirm("Reset the competition demo data?")){localStorage.removeItem(KEY);location.reload();}
});

let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").classList.remove("hidden")});
document.getElementById("installBtn").addEventListener("click",async()=>{
 if(!deferredPrompt){toast("Use your browser menu and choose Install/Add to Home Screen.");return}
 deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null;
});
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
render();
