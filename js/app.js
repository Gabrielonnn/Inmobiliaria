const $ = (selector) => document.querySelector(selector);
const money = (amount, currency = "MXN") => new Intl.NumberFormat("es-MX",{style:"currency",currency,maximumFractionDigits:0}).format(currency==="USD"?amount/17:amount);
const getStored = (key) => { try{return JSON.parse(localStorage.getItem(key))||[]}catch{return []} };
const saveStored = (key,value) => localStorage.setItem(key,JSON.stringify(value));
let currencySelected = "MXN";
let favorites = getStored("sagi_favorites");
let showOnlyFavorites = false;

function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function updateFavorites(){ $("#favoriteCount").textContent=favorites.length;$("#favoriteCount2").textContent=favorites.length;$("#favoriteTotal").textContent=favorites.length; }
function propertyCard(p){
 const fav=favorites.includes(p.id);
 return `<article class="property-card">
  <div class="property-image"><img src="${p.imagen}" alt="${p.titulo}" loading="lazy" onerror="this.src='https://placehold.co/900x600/111d33/ffffff?text=Inmobiliaria+Sagi'"><span class="property-tag">${p.operacion==="Renta"?"RENTA MENSUAL":p.operacion.toUpperCase()}</span><button class="heart ${fav?"fav":""}" data-favorite="${p.id}" aria-label="Agregar a favoritos">${fav?"♥":"♡"}</button></div>
  <div class="property-body"><p class="price">${money(p.precio,currencySelected)} ${currencySelected}</p><div class="location">📍 ${p.zona}, ${p.ciudad}</div><h3 class="property-title">${p.titulo}</h3><div class="features"><span>${p.recamaras} Rec.</span><span>${p.banos} Baños</span><span>${p.superficie} m²</span><span>${p.autos} Autos</span></div><p class="description">${p.descripcion}</p></div>
  <div class="property-bottom"><div class="advisor"><span class="avatar">${p.asesor.split(" ").map(x=>x[0]).slice(0,2).join("")}</span><span>${p.asesor}<small>Asesor certificado</small></span></div><button class="small-btn" data-detail="${p.id}">Ver ficha →</button></div></article>`;
}
function renderProperties(list=propiedades){
 const visible=showOnlyFavorites?list.filter(p=>favorites.includes(p.id)):list;
 $("#propertyGrid").innerHTML=visible.map(propertyCard).join("");
 $("#emptyState").classList.toggle("hidden",visible.length!==0);
 $("#resultsCount").textContent=`Mostrando ${visible.length} propiedades disponibles`;
}
function openDetail(id){
 const p=propiedades.find(x=>x.id===Number(id));if(!p)return;
 $("#propertyDetail").innerHTML=`<img class="detail-image" src="${p.imagen}" alt="${p.titulo}"><p class="eyebrow">${p.operacion} · ${p.tipo}</p><h2>${p.titulo}</h2><p class="price">${money(p.precio,currencySelected)}</p><p class="location">📍 ${p.zona}, ${p.ciudad}</p><div class="features"><span>${p.recamaras} recámaras</span><span>${p.banos} baños</span><span>${p.superficie} m²</span><span>${p.autos} estacionamientos</span></div><p>${p.descripcion}</p><p class="demo-warning">Información y fotografías de demostración.</p><button class="btn btn-gold" id="detailAppointment">Agendar visita</button>`;
 $("#propertyModal").showModal();
 $("#detailAppointment").addEventListener("click",()=>{$("#propertyModal").close();$("#appointmentProperty").value=String(p.id);$("#appointmentModal").showModal()});
}
document.addEventListener("click",e=>{
 const fav=e.target.closest("[data-favorite]");if(fav){const id=Number(fav.dataset.favorite);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];saveStored("sagi_favorites",favorites);updateFavorites();applyFilters();return}
 const detail=e.target.closest("[data-detail]");if(detail)openDetail(detail.dataset.detail);
 if(e.target.matches("[data-close]"))e.target.closest("dialog").close();
});
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>$("#"+b.dataset.open).showModal()));
$("#favoritesShortcut").addEventListener("click",()=>{showOnlyFavorites=true;applyFilters();$("#propiedades").scrollIntoView()});
$("#showFavorites").addEventListener("click",()=>{showOnlyFavorites=!showOnlyFavorites;$("#showFavorites").classList.toggle("selected",showOnlyFavorites);applyFilters()});
$("#operationTabs").addEventListener("click",e=>{const b=e.target.closest("[data-operation]");if(!b)return;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));applyFilters()});
document.querySelectorAll("[data-currency]").forEach(b=>b.addEventListener("click",()=>{currencySelected=b.dataset.currency;document.querySelectorAll(".currency").forEach(x=>x.classList.toggle("active",x===b));applyFilters()}));
$("#mapNotice").addEventListener("click",()=>toast("La vista de mapa se puede integrar en una siguiente etapa."));
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#mainNav").addEventListener("click",e=>{if(e.target.tagName==="A")$("#mainNav").classList.remove("open")});

$("#calculateLoan").addEventListener("click",()=>{
 const price=Number($("#loanPrice").value),down=Number($("#downPayment").value),rate=Number($("#interestRate").value),years=Number($("#loanYears").value);
 if(price<=0||down<0||down>=100||rate<0){toast("Revisa los datos del simulador.");return}
 const principal=price*(1-down/100),r=rate/100/12,n=years*12;
 const payment=r===0?principal/n:principal*r/(1-Math.pow(1+r,-n));
 $("#loanResult").textContent=`Mensualidad estimada: ${money(payment)} · Crédito: ${money(principal)}`;
});
$("#appointmentProperty").innerHTML+=propiedades.map(p=>`<option value="${p.id}">${p.titulo}</option>`).join("");
$("#appointmentForm").addEventListener("submit",e=>{
 e.preventDefault();const item=Object.fromEntries(new FormData(e.target).entries());const all=getStored("sagi_appointments");all.push({...item,createdAt:new Date().toLocaleString("es-MX")});saveStored("sagi_appointments",all);e.target.reset();$("#appointmentModal").close();toast("Solicitud de cita guardada en este navegador.");renderAdmin();
});
$("#valuationForm").addEventListener("submit",e=>{
 e.preventDefault();const item=Object.fromEntries(new FormData(e.target).entries());const all=getStored("sagi_valuations");all.push({...item,createdAt:new Date().toLocaleString("es-MX")});saveStored("sagi_valuations",all);e.target.reset();toast("Solicitud de contacto guardada en este navegador.");renderAdmin();
});
function renderAdmin(){
 const ap=getStored("sagi_appointments"),va=getStored("sagi_valuations");$("#appointmentTotal").textContent=ap.length;$("#valuationTotal").textContent=va.length;
 const rows=[...ap.map(x=>`Cita: ${x.name} · ${x.phone} · ${x.date}`),...va.map(x=>`Valuación: ${x.owner} · ${x.phone} · ${x.address}`)];
 $("#requestList").innerHTML=rows.length?rows.map(x=>`<div>• ${x.replaceAll("<","&lt;")}</div>`).join(""):"Aún no hay solicitudes registradas.";
}
renderProperties();updateFavorites();renderAdmin();