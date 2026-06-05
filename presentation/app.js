const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const key='leavitt-presentation-v1';
const defaults={company:'The Leavitt Group',rep:'Aidan Leavitt',role:'Solar Consultant',bio:'I help homeowners compare their current utility path against a custom solar plan built around their usage, roof, and long-term savings goals.',proofLink:'',accent:'#f4c76b',logo:'',photo:''};
let state={...defaults,...JSON.parse(localStorage.getItem(key)||'{}')};
function money(n){return (Number(n)||0).toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0})}
function showToast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1400)}
function selectedPains(){return $$('#painChecks input:checked').map(i=>i.value)}
function setImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)})}
function applyProfile(){
  document.documentElement.style.setProperty('--gold',state.accent||defaults.accent);
  $$('[data-company]').forEach(e=>e.textContent=state.company||defaults.company);
  $$('[data-rep]').forEach(e=>e.textContent=state.rep||defaults.rep);
  $$('[data-role]').forEach(e=>e.textContent=state.role||defaults.role);
  $('#companyInput').value=state.company||'';
  $('#repInput').value=state.rep||'';
  $('#roleInput').value=state.role||'';
  $('#bioInput').value=state.bio||'';
  $('#proofLinkInput').value=state.proofLink||'';
  $('#accentInput').value=state.accent||defaults.accent;
  $('#bioOutput').textContent=state.bio||defaults.bio;
  $$('[data-logo]').forEach(e=>e.innerHTML=state.logo?`<img alt="Company logo" src="${state.logo}">`:'LG');
  $$('[data-photo]').forEach(e=>e.innerHTML=state.photo?`<img alt="Rep photo" src="${state.photo}">`:'' );
  const proof=$('#proofLink');
  if(state.proofLink){proof.hidden=false;proof.href=state.proofLink}else{proof.hidden=true;proof.href='#'}
}
function saveProfile(){
  state.company=$('#companyInput').value.trim()||defaults.company;
  state.rep=$('#repInput').value.trim()||defaults.rep;
  state.role=$('#roleInput').value.trim()||defaults.role;
  state.bio=$('#bioInput').value.trim()||defaults.bio;
  state.proofLink=$('#proofLinkInput').value.trim();
  state.accent=$('#accentInput').value||defaults.accent;
  localStorage.setItem(key,JSON.stringify(state));
  applyProfile();
  showToast('Saved');
}
async function handleImage(input,field){
  const file=input.files&&input.files[0];
  if(!file)return;
  state[field]=await setImage(file);
  localStorage.setItem(key,JSON.stringify(state));
  applyProfile();
  showToast(field==='logo'?'Logo applied':'Rep photo applied');
}
function calculate(){
  const bill=Number($('#billInput').value)||0;
  const solar=Number($('#solarInput').value)||0;
  const utilityEsc=(Number($('#utilityEscInput').value)||0)/100;
  const solarEsc=(Number($('#solarEscInput').value)||0)/100;
  const years=Math.max(1,Math.min(30,Number($('#yearsInput').value)||25));
  let utilityTotal=0,solarTotal=0,points=[];
  for(let y=1;y<=years;y++){
    const u=bill*Math.pow(1+utilityEsc,y-1)*12;
    const s=solar*Math.pow(1+solarEsc,y-1)*12;
    utilityTotal+=u;solarTotal+=s;points.push({year:y,utility:u,solar:s});
  }
  $('#currentMonthly').textContent=money(bill);
  $('#solarMonthly').textContent=money(solar);
  $('#yearOneSavings').textContent=money((bill-solar)*12);
  $('#lifetimeSavings').textContent=money(utilityTotal-solarTotal);
  $('#previewBill').textContent=money(bill);
  $('#previewSavings').textContent=money(utilityTotal-solarTotal).replace('$','');
  drawChart(points);
  updateScripts();
}
function drawChart(points){
  const canvas=$('#savingsCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,p=46;
  const max=Math.max(...points.flatMap(x=>[x.utility,x.solar]),1);
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=1;
  for(let i=0;i<5;i++){const y=p+i*((H-p*1.5)/4);ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(W-p,y);ctx.stroke()}
  function line(field,color){ctx.beginPath();points.forEach((o,i)=>{const x=p+(i/Math.max(points.length-1,1))*(W-p*2);const y=H-p-(o[field]/max)*(H-p*2);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)});ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap='round';ctx.stroke()}
  line('utility','rgba(255,125,125,.92)');
  line('solar',getComputedStyle(document.documentElement).getPropertyValue('--gold').trim()||'#f4c76b');
  ctx.font='700 20px system-ui';ctx.fillStyle='rgba(251,246,234,.78)';ctx.fillText('Utility path',p,28);
  ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--gold').trim()||'#f4c76b';ctx.fillText('Solar path',p+150,28);
}
function closeScript(){
  const customer=$('#customerName').value.trim()||'this home';
  const goal=$('#customerGoal').value.trim()||'lowering the long-term cost of power';
  const pain=selectedPains();
  return `Based on what you told me, the main goal is ${goal}. Right now ${customer} is paying about ${$('#currentMonthly').textContent}/month to the utility, and this plan starts around ${$('#solarMonthly').textContent}/month with an estimated ${$('#lifetimeSavings').textContent} lifetime difference.\n\nThe big reasons this makes sense are: ${pain.length?pain.join(', '):'monthly control, utility protection, and a cleaner long-term plan'}.\n\nSo the next step is simple: we reserve the project, verify the roof and electrical at site survey, and if anything does not check out, we fix it before install. Fair enough?`;
}
function fullSummary(){
  return `Leavitt Group presentation summary\nCustomer: ${$('#customerName').value.trim()||'Not set'}\nAddress/area: ${$('#customerAddress').value.trim()||'Not set'}\nGoal: ${$('#customerGoal').value.trim()||'Not set'}\nPain points: ${selectedPains().join(', ')||'None selected'}\nNotes: ${$('#painNotes').value.trim()||'None'}\nCurrent bill: ${$('#currentMonthly').textContent}/month\nSolar payment: ${$('#solarMonthly').textContent}/month\nYear 1 savings: ${$('#yearOneSavings').textContent}\nEstimated lifetime delta: ${$('#lifetimeSavings').textContent}\nBattery: ${$('#batteryInput').value==='1'?'Included':'Not included'}\nRep: ${state.rep} · ${state.company}`;
}
function updateScripts(){
  $('#closeScript').textContent=closeScript();
  $('#previewPains').textContent=selectedPains().length;
  const customer=$('#customerName').value.trim()||'not set';
  $('#summaryLine').textContent=`Customer: ${customer} · Bill: ${$('#currentMonthly').textContent} · Solar: ${$('#solarMonthly').textContent} · Est. lifetime delta: ${$('#lifetimeSavings').textContent}`;
}
async function copyText(t){try{await navigator.clipboard.writeText(t);showToast('Copied')}catch(e){showToast('Copy failed')}}
$('#openSettings').onclick=()=>$('#settingsPanel').classList.add('open');
$('#closeSettings').onclick=()=>$('#settingsPanel').classList.remove('open');
$('#saveSettings').onclick=saveProfile;
$('#resetSettings').onclick=()=>{state={...defaults};localStorage.removeItem(key);applyProfile();showToast('Reset')};
$('#logoInput').onchange=e=>handleImage(e.target,'logo');
$('#photoInput').onchange=e=>handleImage(e.target,'photo');
$('#exportSettings').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='leavitt-presentation-settings.json';a.click();URL.revokeObjectURL(url)};
$('#importSettings').onchange=async e=>{const file=e.target.files&&e.target.files[0];if(!file)return;state={...defaults,...JSON.parse(await file.text())};localStorage.setItem(key,JSON.stringify(state));applyProfile();showToast('Imported')};
$('#fullscreenButton').onclick=()=>document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();
['billInput','solarInput','utilityEscInput','solarEscInput','yearsInput','batteryInput'].forEach(id=>$('#'+id).addEventListener('input',calculate));
['customerName','customerAddress','customerGoal','painNotes'].forEach(id=>$('#'+id).addEventListener('input',updateScripts));
$$('#painChecks input').forEach(i=>i.addEventListener('change',updateScripts));
$('#copyClose').onclick=()=>copyText(closeScript());
$('#copySummary').onclick=()=>copyText(fullSummary());
$('#copySummaryTop').onclick=()=>copyText(fullSummary());
$('#copySummaryFloat').onclick=()=>copyText(fullSummary());
applyProfile();
calculate();
