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
function snapshotData(){
  const esc=val('solarEscInput','0');
  const battery=$('#batteryInput')?.value==='1';
  return {
    name:val('customerName'),
    panels:val('panelCountInput','TBD'),
    size:val('systemSizeInput','TBD'),
    solar:txt('solarMonthly')||money(val('solarInput',0)),
    current:txt('currentMonthly')||money(val('billInput',0)),
    esc:Number(esc)?esc+'% / year':'No escalator',
    battery:battery?(val('batteryKwhInput','13.5')+' kWh included'):'Not included',
    survey:val('siteSurveyDate','TBD'),
    diff:txt('lifetimeSavings')||'$0',
    priorities:pains()
  };
}
function shortSnapshot(){
  const d=snapshotData();
  return `${d.name?d.name+' — ':''}Solar quote snapshot\n\nPanels: ${d.panels}\nSystem size: ${d.size} kW\nCurrent utility bill: ${d.current}/mo\nEstimated solar payment: ${d.solar}/mo\nEscalator: ${d.esc}\nBattery: ${d.battery}\nEstimated long-term difference: ${d.diff}\nSite survey: ${d.survey}${d.priorities.length?'\nMain priorities: '+d.priorities.join(', '):''}\n\nFinal numbers come from the approved proposal and utility data.`;
}
function repSnapshot(){
  return `${shortSnapshot()}\n\nInternal notes:\nAddress/area: ${val('customerAddress','Not set')}\nGoal: ${val('customerGoal','Not set')}\nConversation notes: ${val('painNotes','None')}`;
}
function drawLine(ctx,text,x,y,maxWidth,lineHeight){
  const words=String(text).split(' ');let line='',yy=y;
  words.forEach((w,i)=>{let test=line?line+' '+w:w;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,yy);line=w;yy+=lineHeight}else line=test;if(i===words.length-1)ctx.fillText(line,x,yy)});
  return yy+lineHeight;
}
function makeSnapshotBlob(){
  const d=snapshotData(),c=document.createElement('canvas'),ctx=c.getContext('2d');c.width=1080;c.height=1350;
  ctx.fillStyle='#050507';ctx.fillRect(0,0,c.width,c.height);
  let g=ctx.createLinearGradient(0,0,1080,350);g.addColorStop(0,'rgba(244,199,107,.38)');g.addColorStop(1,'rgba(141,255,194,.10)');ctx.fillStyle=g;ctx.fillRect(0,0,1080,330);
  ctx.fillStyle='#f4c76b';ctx.font='800 34px system-ui';ctx.fillText('SOLAR QUOTE SNAPSHOT',70,90);
  ctx.fillStyle='#fbf6ea';ctx.font='900 70px system-ui';drawLine(ctx,d.name||'Home Energy Review',70,180,900,78);
  const rows=[['Panels',d.panels],['System size',d.size+' kW'],['Current utility',d.current+'/mo'],['Solar payment',d.solar+'/mo'],['Escalator',d.esc],['Battery',d.battery],['Long-term difference',d.diff],['Site survey',d.survey]];
  let y=390;rows.forEach(([k,v])=>{ctx.fillStyle='rgba(251,246,234,.58)';ctx.font='800 26px system-ui';ctx.fillText(k.toUpperCase(),70,y);ctx.fillStyle='#fbf6ea';ctx.font='900 46px system-ui';ctx.fillText(String(v),70,y+54);y+=118});
  if(d.priorities.length){ctx.fillStyle='#f4c76b';ctx.font='800 26px system-ui';ctx.fillText('MAIN PRIORITIES',70,y+10);ctx.fillStyle='#fbf6ea';ctx.font='700 34px system-ui';y=drawLine(ctx,d.priorities.join(', '),70,y+58,900,44)}
  ctx.fillStyle='rgba(251,246,234,.62)';ctx.font='600 24px system-ui';drawLine(ctx,'Final numbers come from the approved proposal and utility data.',70,1260,900,32);
  return new Promise(res=>c.toBlob(res,'image/png',.95));
}
async function sendSnapshotImage(){
  const blob=await makeSnapshotBlob();const file=new File([blob],'solar-quote-snapshot.png',{type:'image/png'});
  try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Solar Quote Snapshot',text:'Solar quote snapshot'});toast('Snapshot ready');return}}catch(e){}
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='solar-quote-snapshot.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Snapshot downloaded');
}
function copy(t){navigator.clipboard.writeText(t).then(()=>toast('Copied')).catch(()=>toast('Copy failed'))}
function replaceButton(id,label,handler){
  const old=$('#'+id);if(!old)return null;
  const b=old.cloneNode(true);b.textContent=label;old.replaceWith(b);b.addEventListener('click',e=>{e.preventDefault();handler()});return b;
}
function updatePreview(){const c=$('#customerRecapPreview');if(c)c.textContent=shortSnapshot()}
function setupButtons(){
  $$('a.button,button').forEach(el=>{if((el.textContent||'').trim().toLowerCase()==='begin review')el.remove()});
  const print=$('#printSnapshotButton')||$$('button').find(b=>(b.textContent||'').toLowerCase().includes('print'));
  if(print){print.id='printFullRecapButton';print.textContent='Print Recap'}
  const topSnapshot=replaceButton('copyCustomerTop','Send Snapshot',sendSnapshotImage);
  if(!topSnapshot&&!$('#sendSnapshotButton')){(print?.parentElement||$('.hero-actions'))?.insertAdjacentHTML('beforeend','<button class="button primary" id="sendSnapshotButton">Send Snapshot</button>')}
  $('#sendSnapshotButton')?.addEventListener('click',e=>{e.preventDefault();sendSnapshotImage()});
  replaceButton('copyCustomerRecap','Copy Snapshot',()=>copy(shortSnapshot()));
  replaceButton('copyCustomerRecapBottom','Copy Snapshot',()=>copy(shortSnapshot()));
  replaceButton('copyCustomerFloat','Snapshot',()=>copy(shortSnapshot()));
  replaceButton('copyRepRecap','Copy Rep Notes',()=>copy(repSnapshot()));
  replaceButton('copyRepRecapBottom','Copy Rep Notes',()=>copy(repSnapshot()));
  replaceButton('copyRepFloat','Rep Notes',()=>copy(repSnapshot()));
}
function bindUpdates(){
  ['panelCountInput','systemSizeInput','customerName','customerAddress','customerGoal','painNotes','siteSurveyDate','billInput','solarInput','solarEscInput','batteryInput','batteryKwhInput'].forEach(id=>$('#'+id)?.addEventListener('input',updatePreview));
  $$('#painChecks input').forEach(i=>i.addEventListener('change',updatePreview));
}
function boot(){addDealFields();setupButtons();bindUpdates();updatePreview()}
setTimeout(boot,250);
})();
