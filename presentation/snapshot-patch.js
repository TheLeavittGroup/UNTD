(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const money=n=>(Number(n)||0).toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
const val=(id,d='')=>$('#'+id)?.value?.trim()||d;
const txt=id=>$('#'+id)?.textContent||'';
const pains=()=>$$('#painChecks input:checked').map(i=>i.value);
const toast=t=>{let e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1300)};
function addDealFields(){
  const calc=$('.calc-inputs');
  if(calc&&!$('#panelCountInput')){
    const anchor=$('#solarInput')?.closest('label')||calc.querySelector('label:last-of-type');
    anchor?.insertAdjacentHTML('afterend','<label>Panel count<input id="panelCountInput" type="number" min="0" placeholder="Example: 24"></label><label>System size kW<input id="systemSizeInput" type="number" min="0" step="0.01" placeholder="Example: 9.72"></label>');
  }
}
function shortSnapshot(){
  const name=val('customerName');
  const panels=val('panelCountInput','TBD');
  const size=val('systemSizeInput','TBD');
  const solar=txt('solarMonthly')||money(val('solarInput',0));
  const current=txt('currentMonthly')||money(val('billInput',0));
  const esc=val('solarEscInput','0');
  const battery=$('#batteryInput')?.value==='1';
  const batteryKwh=val('batteryKwhInput','13.5');
  const survey=val('siteSurveyDate','TBD');
  const diff=txt('lifetimeSavings')||'$0';
  const priorities=pains();
  return `${name?name+' — ':''}Solar quote snapshot\n\nPanels: ${panels}\nSystem size: ${size} kW\nCurrent utility bill: ${current}/mo\nEstimated solar payment: ${solar}/mo\nEscalator: ${Number(esc)?esc+'% per year':'No escalator'}\nBattery: ${battery?batteryKwh+' kWh included':'Not included'}\nEstimated long-term difference: ${diff}\nSite survey: ${survey}${priorities.length?'\nMain priorities: '+priorities.join(', '):''}\n\nFinal numbers come from the approved proposal and utility data.`;
}
function repSnapshot(){
  const base=shortSnapshot();
  return `${base}\n\nInternal notes:\nAddress/area: ${val('customerAddress','Not set')}\nGoal: ${val('customerGoal','Not set')}\nConversation notes: ${val('painNotes','None')}`;
}
function copy(t){navigator.clipboard.writeText(t).then(()=>toast('Copied')).catch(()=>toast('Copy failed'))}
function replaceButton(id,label,handler){
  const old=$('#'+id);if(!old)return;
  const b=old.cloneNode(true);b.textContent=label;old.replaceWith(b);b.addEventListener('click',e=>{e.preventDefault();handler()});
}
function updatePreview(){
  const c=$('#customerRecapPreview');if(c)c.textContent=shortSnapshot();
}
function setupButtons(){
  const print=$('#printSnapshotButton')||$$('button').find(b=>(b.textContent||'').toLowerCase().includes('print'));
  if(print){print.id='printFullRecapButton';print.textContent='Print Full Recap'}
  if(!$('#sendSnapshotButton')){
    const target=print?.parentElement||$('.hero-actions');
    target?.insertAdjacentHTML('beforeend','<button class="button primary" id="sendSnapshotButton">Send Snapshot</button>');
  }
  replaceButton('copyCustomerTop','Send Snapshot',()=>copy(shortSnapshot()));
  replaceButton('copyCustomerRecap','Copy Snapshot',()=>copy(shortSnapshot()));
  replaceButton('copyCustomerRecapBottom','Copy Snapshot',()=>copy(shortSnapshot()));
  replaceButton('copyCustomerFloat','Snapshot',()=>copy(shortSnapshot()));
  replaceButton('copyRepRecap','Copy Rep Notes',()=>copy(repSnapshot()));
  replaceButton('copyRepRecapBottom','Copy Rep Notes',()=>copy(repSnapshot()));
  replaceButton('copyRepFloat','Rep Notes',()=>copy(repSnapshot()));
  $('#sendSnapshotButton')?.addEventListener('click',e=>{e.preventDefault();copy(shortSnapshot())});
}
function bindUpdates(){
  ['panelCountInput','systemSizeInput','customerName','customerAddress','customerGoal','painNotes','siteSurveyDate','billInput','solarInput','solarEscInput','batteryInput','batteryKwhInput'].forEach(id=>$('#'+id)?.addEventListener('input',updatePreview));
  $$('#painChecks input').forEach(i=>i.addEventListener('change',updatePreview));
}
function boot(){addDealFields();setupButtons();bindUpdates();updatePreview()}
setTimeout(boot,250);
})();
