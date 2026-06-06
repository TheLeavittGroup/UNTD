(()=>{
const $=(s,r=document)=>r.querySelector(s);
function injectStyle(){
  if(document.getElementById('planPolishStyles'))return;
  const style=document.createElement('style');style.id='planPolishStyles';style.textContent=`
    #solution.plan-polished{padding-top:38px!important}
    #solution.plan-polished .section-head{align-items:flex-start!important;margin-bottom:18px!important}
    #solution.plan-polished .section-head h2{font-size:clamp(34px,4.4vw,62px)!important;line-height:.98!important;max-width:760px!important}
    #solution.plan-polished .section-head p{max-width:460px!important;font-size:15px!important}
    #solution.plan-polished .slides{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px!important;align-items:stretch!important}
    #solution.plan-polished .slide{min-height:0!important;padding:22px!important;border-radius:28px!important;display:flex!important;flex-direction:column!important;gap:14px!important;overflow:hidden!important;position:relative!important;background:linear-gradient(180deg,rgba(255,255,255,.105),rgba(255,255,255,.048))!important;border:1px solid rgba(255,255,255,.16)!important;box-shadow:0 18px 55px rgba(0,0,0,.24)!important}
    #solution.plan-polished .slide:after{display:none!important}
    #solution.plan-polished .plan-icon{width:46px;height:46px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(135deg,var(--gold,#f4c76b),#fff0b8);color:#090805;font-weight:950;font-size:20px;margin-bottom:2px}
    #solution.plan-polished .slide .eyebrow{margin:0!important;font-size:10px!important;letter-spacing:.14em!important;color:rgba(244,199,107,.92)!important}
    #solution.plan-polished .slide h2{font-size:clamp(24px,2.3vw,36px)!important;line-height:1.03!important;letter-spacing:-.035em!important;margin:0!important;max-width:100%!important}
    #solution.plan-polished .slide p{font-size:15px!important;line-height:1.48!important;color:rgba(251,246,234,.72)!important;margin:0!important}
    #solution.plan-polished .plan-list{list-style:none;margin:4px 0 0;padding:0;display:grid;gap:8px}
    #solution.plan-polished .plan-list li{display:flex;gap:9px;align-items:flex-start;color:rgba(251,246,234,.82);font-size:14px;line-height:1.38}
    #solution.plan-polished .plan-list li:before{content:'✓';flex:0 0 20px;width:20px;height:20px;border-radius:999px;background:rgba(244,199,107,.14);color:var(--gold,#f4c76b);display:grid;place-items:center;font-size:12px;font-weight:950;margin-top:1px}
    #solution.plan-polished .plan-note{margin-top:auto!important;border:1px solid rgba(244,199,107,.22)!important;background:rgba(244,199,107,.075)!important;border-radius:18px!important;padding:12px!important;color:rgba(251,246,234,.86)!important;font-size:13px!important;line-height:1.42!important}
    @media(max-width:980px){#solution.plan-polished .slides{grid-template-columns:1fr!important}#solution.plan-polished .slide{padding:20px!important}#solution.plan-polished .slide h2{font-size:30px!important}}
    @media(max-width:560px){#solution.plan-polished .section-head h2{font-size:32px!important}#solution.plan-polished .slide h2{font-size:26px!important}.plan-icon{width:42px!important;height:42px!important}}
  `;document.head.appendChild(style);
}
function polish(){
  const section=$('#solution');if(!section)return;
  section.classList.add('plan-polished');
  const head=section.querySelector('.section-head');
  if(head){head.innerHTML=`<div><p class="eyebrow">Your plan</p><h2>Your plan, broken down clearly.</h2></div><p>No giant wall of text. Just what the homeowner needs to understand: the current path, the custom design, and the protection behind it.</p>`}
  const slides=section.querySelector('.slides');if(!slides)return;
  slides.innerHTML=`
    <article class="slide">
      <div class="plan-icon">1</div>
      <p class="eyebrow">Current path</p>
      <h2>What happens if nothing changes?</h2>
      <p>Your utility bill can keep moving while the home still needs power every month.</p>
      <ul class="plan-list">
        <li>Current bill stays exposed to future rate changes</li>
        <li>No added backup unless the home already has storage</li>
        <li>No control over when utility pricing changes</li>
      </ul>
      <p class="plan-note">This is the baseline we compare against.</p>
    </article>
    <article class="slide">
      <div class="plan-icon">2</div>
      <p class="eyebrow">Home-specific design</p>
      <h2>What the solar plan is built around.</h2>
      <p>The proposal should match the actual home, usage, roof, shade, and utility rules.</p>
      <ul class="plan-list">
        <li>Panel count and system size based on the home</li>
        <li>Battery option reviewed when it improves the plan</li>
        <li>Payment, escalator, and savings shown clearly</li>
      </ul>
      <p class="plan-note">The design only matters if it solves the homeowner’s real goal.</p>
    </article>
    <article class="slide">
      <div class="plan-icon">3</div>
      <p class="eyebrow">Protection and process</p>
      <h2>How the project moves forward safely.</h2>
      <p>The next step verifies the home before final design and install.</p>
      <ul class="plan-list">
        <li>Site survey checks roof, shade, attic, and electrical</li>
        <li>Design and permitting confirm the final layout</li>
        <li>Install, activation, monitoring, and support follow</li>
      </ul>
      <p class="plan-note">Nothing should feel confusing before the homeowner moves forward.</p>
    </article>`;
}
function boot(){injectStyle();polish()}
setTimeout(boot,500);
})();
