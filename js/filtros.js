function applyFilters(){
 const operation=document.querySelector(".tab.active")?.dataset.operation||"Todos";
 const city=document.querySelector("#cityFilter").value.toLowerCase();
 const type=document.querySelector("#typeFilter").value.toLowerCase();
 const beds=Number(document.querySelector("#bedFilter").value);
 const keyword=document.querySelector("#keywordFilter").value.toLowerCase().trim();
 const result=propiedades.filter(p=>{
  const text=`${p.titulo} ${p.descripcion} ${p.zona} ${p.ciudad} ${p.tipo}`.toLowerCase();
  return (operation==="Todos"||p.operacion===operation)&&(!city||p.ciudad.toLowerCase().includes(city))&&(!type||p.tipo.toLowerCase()===type)&&p.recamaras>=beds&&(!keyword||text.includes(keyword));
 });
 renderProperties(result);
}
["cityFilter","typeFilter","bedFilter"].forEach(id=>document.getElementById(id).addEventListener("change",applyFilters));
document.getElementById("keywordFilter").addEventListener("input",applyFilters);
document.getElementById("clearFilters").addEventListener("click",()=>{
 ["cityFilter","typeFilter","keywordFilter"].forEach(id=>document.getElementById(id).value="");
 document.getElementById("bedFilter").value="0";
 document.querySelectorAll(".tab").forEach((b,i)=>b.classList.toggle("active",i===0));
 showOnlyFavorites=false;document.getElementById("showFavorites").classList.remove("selected");applyFilters();
});