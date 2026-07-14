(()=>{
  const pdfUrl='https://untd.solar/joinus/wp-content/uploads/2024/03/Owe-Arizona-PP-.pdf';
  const style=document.createElement('style');
  style.textContent=`
    #oweProposalDraft{background:#eef3fb;color:#111;font-family:Arial,Helvetica,sans-serif;position:relative;z-index:30}
    #oweProposalDraft *{box-sizing:border-box}
    .owe-draft-bar{position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px;background:rgba(255,255,255,.96);border-bottom:1px solid #d9e1ee;box-shadow:0 8px 24px rgba(22,37,68,.12)}
    .owe-draft-brand{display:flex;align-items:center;gap:11px}.owe-draft-mark{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;border:3px solid #111;font-weight:900}.owe-draft-brand strong{display:block;font-size:16px}.owe-draft-brand small{display:block;color:#657087;font-weight:700}
    .owe-draft-actions{display:flex;gap:8px;flex-wrap:wrap}.owe-draft-actions a,.owe-draft-actions button{border:0;border-radius:999px;padding:11px 15px;font-weight:900;cursor:pointer;text-decoration:none;background:#2456cc;color:#fff}.owe-draft-actions .secondary{background:#eef2fa;color:#1b2947;border:1px solid #ced8eb}
    .owe-pdf-wrap{width:100%;height:calc(100vh - 67px);min-height:650px;background:#dfe7f4}.owe-pdf-wrap iframe{width:100%;height:100%;border:0;background:#fff}
    .owe-proof-strip{padding:22px max(18px,5vw) 28px;background:#fff;border-top:1px solid #dce4f0}.owe-proof-strip h2{margin:0 0 7px;font-size:clamp(24px,3vw,38px);letter-spacing:-.035em}.owe-proof-strip>p{margin:0 0 16px;color:#59647a;font-weight:700}.owe-proof-links{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}.owe-proof-links a{min-height:82px;border:1px solid #d8dfec;border-radius:16px;padding:13px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;text-decoration:none;color:#15213c;background:#f7f9fd;font-weight:900;box-shadow:0 7px 20px rgba(30,48,84,.07)}.owe-proof-links a small{display:block;color:#657087;margin-top:5px;font-weight:700}
    #legacyToolsHeading{background:#050507;color:#f7f4ec;padding:52px max(20px,6vw) 26px;border-top:8px solid #2456cc;position:relative;z-index:20}#legacyToolsHeading p{margin:0 0 8px;color:#f4c76b;font-weight:950;letter-spacing:.13em;text-transform:uppercase;font-size:12px}#legacyToolsHeading h2{margin:0;font-size:clamp(32px,5vw,64px);letter-spacing:-.055em;line-height:1}#legacyToolsHeading .legacy-note{margin-top:12px;color:#b9b6ad;max-width:760px;font-size:17px;line-height:1.5;text-transform:none;letter-spacing:0}
    body:not(.legacy-tools-visible) .deal-bar{display:none!important}
    @media(max-width:900px){.owe-proof-links{grid-template-columns:repeat(3,minmax(0,1fr))}.owe-draft-brand small{display:none}}
    @media(max-width:600px){.owe-draft-bar{align-items:flex-start;padding:9px 10px}.owe-draft-mark{width:36px;height:36px}.owe-draft-actions a,.owe-draft-actions button{padding:9px 11px;font-size:12px}.owe-pdf-wrap{height:82vh;min-height:560px}.owe-proof-links{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const shell=document.createElement('section');
  shell.id='oweProposalDraft';
  shell.innerHTML=`
    <div class="owe-draft-bar">
      <div class="owe-draft-brand"><span class="owe-draft-mark">WE</span><span><strong>Daddy's Proposal Tool</strong><small>OWE Arizona presentation · first draft</small></span></div>
      <div class="owe-draft-actions">
        <a href="${pdfUrl}" target="_blank" rel="noopener">Open Full Screen</a>
        <button class="secondary" id="jumpToLegacyTools" type="button">Tools & Calculators</button>
      </div>
    </div>
    <div class="owe-pdf-wrap"><iframe title="OWE Arizona solar presentation" src="${pdfUrl}#view=FitH&toolbar=0&navpanes=0"></iframe></div>
    <div class="owe-proof-strip">
      <h2>Installer proof and credentials</h2>
      <p>These buttons stay clickable during the presentation and open the public proof in a new tab.</p>
      <div class="owe-proof-links">
        <a href="https://www.google.com/search?q=Our+World+Energy+reviews" target="_blank" rel="noopener">Google Reviews<small>Customer ratings</small></a>
        <a href="https://www.solarpowerworldonline.com/top-solar-contractors/" target="_blank" rel="noopener">Top Solar Contractors<small>Industry ranking</small></a>
        <a href="https://www.solarpowerworldonline.com/" target="_blank" rel="noopener">Solar Industry Award<small>Recognition source</small></a>
        <a href="https://www.inc.com/inc5000" target="_blank" rel="noopener">Inc. 5000<small>Growth recognition</small></a>
        <a href="https://www.bbb.org/us/az/phoenix/profile/solar-energy-products/our-world-energy-llc-1126-1000055984" target="_blank" rel="noopener">BBB Profile<small>Accreditation profile</small></a>
        <a href="https://directories.nabcep.org/" target="_blank" rel="noopener">NABCEP<small>Credential directory</small></a>
      </div>
    </div>`;

  const firstBodyChild=document.body.firstElementChild;
  document.body.insertBefore(shell,firstBodyChild);

  const legacyHeading=document.createElement('section');
  legacyHeading.id='legacyToolsHeading';
  legacyHeading.innerHTML='<p>Saved from the original tool</p><h2>Calculators, auto-texts and rep tools</h2><p class="legacy-note">Nothing important was removed. The live math, customer snapshots, rep notes, copy-and-paste follow-ups, personalization controls, quote details and next-step tools are all preserved below for us to reorganize later.</p>';
  const originalHeader=shell.nextElementSibling;
  document.body.insertBefore(legacyHeading,originalHeader);

  document.getElementById('jumpToLegacyTools')?.addEventListener('click',()=>legacyHeading.scrollIntoView({behavior:'smooth',block:'start'}));
  const observer=new IntersectionObserver(entries=>{document.body.classList.toggle('legacy-tools-visible',entries.some(e=>e.isIntersecting));},{threshold:.02});
  observer.observe(legacyHeading);
})();