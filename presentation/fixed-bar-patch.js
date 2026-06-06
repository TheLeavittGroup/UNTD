(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const touched=new Set();
const val=(id)=>$('#'+id)?.value?.trim()||'';
const txt=(id)=>$('#'+id)?.textContent?.trim()||'';
const pains=()=>$$('#painChecks input:checked').map(i=>i.value);
function inject(){
  if($('#fixedBarPatchStyles'))return;
  const style=document.createElement('style');style.id='fixedBarPatchStyles';style.textContent=`
    body{padding-bottom:132px!important}
    .deal-bar{position:fixed!important;left:50%!important;right:auto!important;bottom:12px!important;transform:translateX(-50%)!important;width:calc(100% - 24px)!important;max-width:1180px!important;margin:0!important;z-index:1200!important;border-radius:28px!important;box-shadow:0 20px 70px rgba(0,0,0,.48)!important;align-items:center!important}
    .deal-bar small{font-size:11px!important;letter-spacing:.12em!important;text-transform:uppercase!important;font-weight:900!important;color:#f4c76b!important}
    .deal-bar strong{display:block!important;max-width:820px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;line-height:1.35!important}
    .deal-bar.empty strong{display:block!important;color:#8f887d!important;font-weight:700!important}
    .deal-bar.empty .hero-actions{display:none!important}
    .deal-bar .hero-actions{flex:0 0 auto!important}
    @media(max-width:760px){body{padding-bottom:168px!important}.deal-bar{bottom:8px!important;border-radius:22px!important;display:grid!important;grid-template-columns:1fr!important;gap:10px!important}.deal-bar strong{white-space:normal!important;max-width:100%!important;font-size:12px!important}.deal-bar .hero-actions{display:grid!important;grid-template-columns:1fr 1fr!important;width:100%!important}.deal-bar .button{width:100%!important}}
    @media print{.deal-bar{display:none!important}body{padding-bottom:0!important}}
  `;document.head.appendChild(style);
}
function keyParts(){
  const parts=[];
  const name=val('customerName'), panels=val('panelCountInput'), size=val('systemSizeInput'), survey=val('siteSurveyDate'), solar=txt('solarMonthly'), bill=txt('currentMonthly'), diff=txt('lifetimeSavings'), esc=val('solarEscInput'), battery=$('#batteryInput')?.value==='1', batteryKwh=val('batteryKwhInput');
  if(name)parts.push(name);
  if(panels)parts.push(`${panels} panels`);
  if(size)parts.push(`${size} kW`);
  if(touched.has('solarInput')&&solar)parts.push(`${solar}/mo solar`);
  if(touched.has('solarEscInput'))parts.push(Number(esc)?`${esc}% escalator`:'No escalator');
  if(touched.has('batteryInput')||batteryKwh)parts.push(battery?`${batteryKwh||'13.5'} kWh battery`:'No battery');
  if(survey)parts.push(`Survey ${survey}`);
  if((touched.has('billInput')||touched.has('solarInput')||touched.has('batteryInput'))&&diff)parts.push(`${diff} difference`);
  const p=pains();if(p.length)parts.push(`${p.length} priorities`);
  return parts;
}
function updateBar(){
  const bar=$('.deal-bar'), label=$('.deal-bar small'), summary=$('#summaryLine');if(!bar||!summary)return;
  if(label)label.textContent='Quote Details';
  const parts=keyParts();
  bar.classList.toggle('empty',!parts.length);
  bar.classList.toggle('has-details',!!parts.length);
  summary.textContent=parts.length?parts.join(' · '):'Add quote details as you go';
}
function bind(){
  ['customerName','panelCountInput','systemSizeInput','siteSurveyDate','solarInput','billInput','solarEscInput','batteryInput','batteryKwhInput'].forEach(id=>$('#'+id)?.addEventListener('input',()=>{touched.add(id);setTimeout(updateBar,0)}));
  $$('#painChecks input').forEach(i=>i.addEventListener('change',()=>setTimeout(updateBar,0)));
  ['click','keyup','change'].forEach(evt=>document.addEventListener(evt,()=>setTimeout(updateBar,60),true));
}
function boot(){inject();bind();updateBar();setInterval(updateBar,1200)}
setTimeout(boot,420);
})();
