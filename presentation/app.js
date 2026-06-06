const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const key='leavitt-presentation-v1';
const defaults={company:'The Leavitt Group',rep:'Aidan Leavitt',role:'Home Energy Consultant',bio:'I help homeowners compare their current utility path against a custom solar plan built around their usage, roof, and long-term savings goals.',proofLink:'',accent:'#f4c76b',logo:'',photo:''};
let state={...defaults,...JSON.parse(localStorage.getItem(key)||'{}')};
const quoteTouched=new Set();
function money(n){return (Number(n)||0).toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0})}
function showToast(t){const e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1400)}
function selectedPains(){const box=$('#painChecks');return box?$$('input:checked',box).map(i=>i.value):[]}
function value(id,fallback=''){const e=$('#'+id);return e?e.value.trim()||fallback:fallback}
function text(id,t){const e=$('#'+id);if(e)e.textContent=t}
function setImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)})}
function applyProfile(){
  document.documentElement.style.setProperty('--gold',state.accent||defaults.accent);
  $$('[data-company]').forEach(e=>e.textContent=state.company||defaults.company);
  $$('[data-rep]').forEach(e=>e.textContent=state.rep||defaults.rep);
  $$('[data-role]').forEach(e=>e.textContent=state.role||defaults.role);
  const map={companyInput:state.company||'',repInput:state.rep||'',roleInput:state.role||'',bioInput:state.bio||'',proofLinkInput:state.proofLink||'',accentInput:state.accent||defaults.accent};
  Object.entries(map).forEach(([id,val])=>{const e=$('#'+id);if(e)e.value=val});
  text('bioOutput',state.bio||defaults.bio);
  $$('[data-logo]').forEach(e=>e.innerHTML=state.logo?`<img alt="Company logo" src="${state.logo}">`:'LG');
  $$('[data-photo]').forEach(e=>e.innerHTML=state.photo?`<img alt="Consultant photo" src="${state.photo}">`:'' );
  const proof=$('#proofLink');
  if(proof){if(state.proofLink){proof.hidden=false;proof.href=state.proofLink}else{proof.hidden=true;proof.href='#'}}
}
function saveProfile(){
  state.company=value('companyInput',defaults.company);
  state.rep=value('repInput',defaults.rep);
  state.role=value('roleInput',defaults.role);
  state.bio=value('bioInput',defaults.bio);
  state.proofLink=value('proofLinkInput','');
  const accent=$('#accentInput');state.accent=accent?accent.value:defaults.accent;
  localStorage.setItem(key,JSON.stringify(state));
  applyProfile();showToast('Saved');
}
async function handleImage(input,field){const file=input.files&&input.files[0];if(!file)return;state[field]=await setImage(file);localStorage.setItem(key,JSON.stringify(state));applyProfile();showToast(field==='logo'?'Logo applied':'Photo applied')}
function numbers(){return {bill:Number($('#billInput')?.value)||0,solar:Number($('#solarInput')?.value)||0,utilityEsc:(Number($('#utilityEscInput')?.value)||0)/100,solarEsc:(Number($('#solarEscInput')?.value)||0)/100,years:Math.max(1,Math.min(30,Number($('#yearsInput')?.value)||25)),battery:$('#batteryInput')?.value==='1'}}
function calculate(){
  const n=numbers();let utilityTotal=0,solarTotal=0,points=[];
  for(let y=1;y<=n.years;y++){const u=n.bill*Math.pow(1+n.utilityEsc,y-1)*12;const s=n.solar*Math.pow(1+n.solarEsc,y-1)*12;utilityTotal+=u;solarTotal+=s;points.push({year:y,utility:u,solar:s})}
  text('currentMonthly',money(n.bill));text('solarMonthly',money(n.solar));text('yearOneSavings',money((n.bill-n.solar)*12));text('lifetimeSavings',money(utilityTotal-solarTotal));text('previewBill',money(n.bill));text('previewSavings',money(utilityTotal-solarTotal).replace('$',''));
  drawChart(points);updateScripts();
}
function drawChart(points){
  const canvas=$('#savingsCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');const W=canvas.width,H=canvas.height,p=46;const max=Math.max(...points.flatMap(x=>[x.utility,x.solar]),1);ctx.clearRect(0,0,W,H);ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=1;
  for(let i=0;i<5;i++){const y=p+i*((H-p*1.5)/4);ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(W-p,y);ctx.stroke()}
  function line(field,color){ctx.beginPath();points.forEach((o,i)=>{const x=p+(i/Math.max(points.length-1,1))*(W-p*2);const y=H-p-(o[field]/max)*(H-p*2);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap='round';ctx.stroke()}
  line('utility','rgba(255,125,125,.92)');line('solar',getComputedStyle(document.documentElement).getPropertyValue('--gold').trim()||'#f4c76b');ctx.font='700 20px system-ui';ctx.fillStyle='rgba(251,246,234,.78)';ctx.fillText('Utility path',p,28);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--gold').trim()||'#f4c76b';ctx.fillText('Solar path',p+150,28);
}
function closeScript(){
  const customer=value('customerName','this home');const goal=value('customerGoal','lowering the long-term cost of power');const pains=selectedPains();
  return `Based on what you shared, the main goal is ${goal}. Right now ${customer} is around ${$('#currentMonthly')?.textContent||'$0'}/month with the utility, and this plan is estimated around ${$('#solarMonthly')?.textContent||'$0'}/month.\n\nThe biggest priorities we talked about are: ${pains.length?pains.join(', '):'monthly control, utility protection, and a cleaner long-term plan'}.\n\nThe next step is simply to verify the home at survey and confirm the final design before install.`;
}
function customerRecap(){
  const n=numbers();const customer=value('customerName','');const goal=value('customerGoal','a more predictable energy plan');const pains=selectedPains();const battery=n.battery?'Included / review backup and time-of-use strategy':'Not included in this estimate';
  const arbitrage=n.battery?'If the utility plan supports time-of-use savings, the battery strategy can be reviewed for storing lower-cost solar energy and reducing higher-cost usage windows.':'Battery storage and rate-arbitrage are not included in this version of the estimate.';
  return `Home energy review${customer?` for ${customer}`:''}\n\nWhat we looked at:\n- Main goal: ${goal}\n- Priorities: ${pains.length?pains.join(', '):'lower cost, predictability, and long-term control'}\n\nEstimated numbers:\n- Current utility bill: ${$('#currentMonthly')?.textContent||'$0'}/month\n- Estimated solar payment: ${$('#solarMonthly')?.textContent||'$0'}/month\n- Estimated year 1 difference: ${$('#yearOneSavings')?.textContent||'$0'}\n- Estimated ${n.years}-year difference: ${$('#lifetimeSavings')?.textContent||'$0'}\n- Backup/battery: ${battery}\n\nBattery / rate note:\n${arbitrage}\n\nSimple next step:\nA home survey verifies the roof, electrical, shade, and final design before the project moves forward.\n\nThis is a visual estimate. Final numbers come from the approved proposal and utility data.\n\n${state.rep}\n${state.company}`;
}
function repRecap(){
  const n=numbers();const customer=value('customerName','Not set');const address=value('customerAddress','Not set');const goal=value('customerGoal','Not set');const notes=value('painNotes','None');const pains=selectedPains();
  return `Internal rep recap\n\nCustomer: ${customer}\nAddress/area: ${address}\nMain goal: ${goal}\nPain points/priorities: ${pains.join(', ')||'None selected'}\nConversation notes: ${notes}\n\nNumbers shown:\n- Current utility bill: ${$('#currentMonthly')?.textContent||'$0'}/month\n- Estimated solar payment: ${$('#solarMonthly')?.textContent||'$0'}/month\n- Year 1 difference: ${$('#yearOneSavings')?.textContent||'$0'}\n- Estimated ${n.years}-year difference: ${$('#lifetimeSavings')?.textContent||'$0'}\n- Utility increase used: ${(n.utilityEsc*100).toFixed(2)}%\n- Solar adjustment used: ${(n.solarEsc*100).toFixed(2)}%\n- Battery: ${n.battery?'Included':'Not included'}\n\nFollow-up angle:\nTie the next conversation back to ${pains.length?pains.join(', '):'their stated goal and the cost comparison'}. Keep it simple and confirm the home survey as the next step.\n\nRep: ${state.rep} · ${state.company}`;
}
function updateQuoteBar(){
  const bar=$('.deal-bar');const summary=$('#summaryLine');if(!bar||!summary)return;
  const parts=[];const customer=value('customerName','');const address=value('customerAddress','');const goal=value('customerGoal','');const pains=selectedPains();const n=numbers();
  if(customer)parts.push(customer);if(address)parts.push(address);if(goal)parts.push(`Goal: ${goal.length>48?goal.slice(0,48)+'...':goal}`);if(pains.length)parts.push(`${pains.length} priorities`);
  const billTouched=quoteTouched.has('billInput'),solarTouched=quoteTouched.has('solarInput'),batteryTouched=quoteTouched.has('batteryInput');
  if(billTouched)parts.push(`Bill ${$('#currentMonthly')?.textContent||money(n.bill)}`);if(solarTouched)parts.push(`Solar ${$('#solarMonthly')?.textContent||money(n.solar)}`);
  if(billTouched||solarTouched)parts.push(`Difference ${$('#lifetimeSavings')?.textContent||'$0'}`);if(batteryTouched)parts.push(n.battery?'Battery included':'No battery');
  const has=parts.length>0;summary.textContent=has?parts.join(' · '):'';bar.classList.toggle('empty',!has);bar.classList.toggle('has-details',has);
}
function updateScripts(){
  text('closeScript',closeScript());text('previewPains',String(selectedPains().length));text('customerRecapPreview',customerRecap());text('repRecapPreview',repRecap());updateQuoteBar();
}
async function copyText(t){try{await navigator.clipboard.writeText(t);showToast('Copied')}catch(e){showToast('Copy failed')}}
function bind(id,fn){const e=$('#'+id);if(e)e.addEventListener('click',fn)}
function initPresentationTabs(){
  const css=document.createElement('style');css.textContent=`body.tabbed-presentation{padding-top:76px;padding-bottom:104px}.tabbed-presentation .topbar{position:fixed;top:0;left:0;right:0;z-index:1000;box-shadow:0 18px 45px rgba(0,0,0,.28)}.stage-hidden{display:none!important}.tabbed-presentation main>section:not(.stage-hidden){animation:stageFade .18s ease-out}.tabbed-presentation .nav a.active{background:var(--gold,#f4c76b);border-color:var(--gold,#f4c76b);color:#090805}.deal-bar.empty .hero-actions{display:none}.deal-bar.empty strong{display:none}.deal-bar.empty{justify-content:flex-start}.deal-bar.empty small:after{content:'  Add details as you go';color:#8f887d;font-weight:700;margin-left:8px}@keyframes stageFade{from{opacity:.25;transform:translateY(8px)}to{opacity:1;transform:none}}@media(max-width:900px){body.tabbed-presentation{padding-top:118px}.tabbed-presentation .topbar-inner{height:auto;min-height:0;flex-wrap:wrap;padding-top:8px;padding-bottom:8px}.tabbed-presentation .nav{display:flex!important;order:3;width:100%;overflow-x:auto;padding-bottom:2px}.tabbed-presentation .nav a{flex:0 0 auto}.tabbed-presentation .brand{min-width:0;flex:1}.tabbed-presentation .brand small{display:none}.tabbed-presentation .topbar .button{flex:0 0 auto}.deal-bar.has-details{align-items:flex-start}}@media(max-width:520px){body.tabbed-presentation{padding-top:112px}.tabbed-presentation .nav a{font-size:11px;padding:9px 10px}.tabbed-presentation .deal-bar .hero-actions{display:grid;grid-template-columns:1fr 1fr;width:100%}.tabbed-presentation .deal-bar .button{width:100%}}`;
  document.head.appendChild(css);document.body.classList.add('tabbed-presentation');
  const sections=$$('main>section');if(sections[2]&&!sections[2].id)sections[2].id='home-details';
  const groups={hero:['hero'],discover:['discover','home-details'],money:['money'],solution:['solution'],proof:['proof'],close:['close']};
  const links=$$('.nav a');
  function showStage(id){const stage=groups[id]?id:'hero';sections.forEach(s=>s.classList.add('stage-hidden'));groups[stage].forEach(sectionId=>$('#'+sectionId)?.classList.remove('stage-hidden'));links.forEach(a=>a.classList.toggle('active',(a.getAttribute('href')||'').replace('#','')===stage));if(location.hash!==`#${stage}`)history.replaceState(null,'',`#${stage}`);window.scrollTo({top:0,behavior:'smooth'});}
  links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showStage((a.getAttribute('href')||'#hero').replace('#',''))}));
  showStage((location.hash||'#hero').replace('#',''));
}
bind('openSettings',()=>$('#settingsPanel')?.classList.add('open'));
bind('closeSettings',()=>$('#settingsPanel')?.classList.remove('open'));
bind('saveSettings',saveProfile);
bind('resetSettings',()=>{state={...defaults};localStorage.removeItem(key);applyProfile();updateScripts();showToast('Reset')});
const logo=$('#logoInput');if(logo)logo.onchange=e=>handleImage(e.target,'logo');
const photo=$('#photoInput');if(photo)photo.onchange=e=>handleImage(e.target,'photo');
bind('exportSettings',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='leavitt-presentation-settings.json';a.click();URL.revokeObjectURL(url)});
const importer=$('#importSettings');if(importer)importer.onchange=async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;state={...defaults,...JSON.parse(await file.text())};localStorage.setItem(key,JSON.stringify(state));applyProfile();updateScripts();showToast('Imported')};
bind('fullscreenButton',()=>document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen());
['billInput','solarInput','utilityEscInput','solarEscInput','yearsInput','batteryInput'].forEach(id=>$('#'+id)?.addEventListener('input',()=>{quoteTouched.add(id);calculate()}));
['customerName','customerAddress','customerGoal','painNotes'].forEach(id=>$('#'+id)?.addEventListener('input',updateScripts));
$$('#painChecks input').forEach(i=>i.addEventListener('change',updateScripts));
['copyCustomerTop','copyCustomerRecap','copyCustomerRecapBottom','copyCustomerFloat'].forEach(id=>bind(id,()=>copyText(customerRecap())));
['copyRepRecap','copyRepRecapBottom','copyRepFloat'].forEach(id=>bind(id,()=>copyText(repRecap())));
applyProfile();calculate();initPresentationTabs();updateQuoteBar();
