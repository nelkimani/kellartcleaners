// ===== KELLART CLEANERS — shared site behaviour =====

const WHATSAPP_NUMBER = "254111412474"; // no leading +, no spaces

function waLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function track(name, params){
  if (typeof window.trackEvent === 'function') window.trackEvent(name, params);
}

function initWhatsappLinks(){
  document.querySelectorAll('[data-wa]').forEach(el=>{
    const msg = el.getAttribute('data-wa') || "Hello Kellart Cleaners, I would like to enquire about your cleaning services.";
    el.setAttribute('href', waLink(msg));
    el.setAttribute('target','_blank');
    el.setAttribute('rel','noopener');
    el.addEventListener('click', ()=>{
      track('whatsapp_click', {page: location.pathname, message: msg});
    });
  });
}

/* ---------------- Phone / email click tracking ---------------- */
function initContactClickTracking(){
  document.querySelectorAll('a[href^="tel:"]').forEach(el=>{
    el.addEventListener('click', ()=> track('phone_click', {page: location.pathname, number: el.getAttribute('href')}));
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(el=>{
    el.addEventListener('click', ()=> track('email_click', {page: location.pathname, address: el.getAttribute('href')}));
  });
}

/* ---------------- CTA click tracking ---------------- */
function initCtaClickTracking(){
  document.querySelectorAll('[data-open-quote]').forEach(el=>{
    el.addEventListener('click', ()=>{
      track('cta_click', {page: location.pathname, label: (el.textContent || '').trim()});
    });
  });
}

function initNavScroll(){
  const nav = document.querySelector('.nav');
  if(!nav) return;
  const onScroll = ()=>{
    if(window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

function initMobileMenu(){
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu__close');
  if(!toggle || !menu) return;
  toggle.addEventListener('click', ()=> menu.classList.add('is-open'));
  close && close.addEventListener('click', ()=> menu.classList.remove('is-open'));
  menu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> menu.classList.remove('is-open')));
}

/* ---------------- Quote Modal ---------------- */
const QuoteModal = (()=>{
  let currentStep = 1;
  let selectedService = null;

  function open(prefillService){
    const overlay = document.getElementById('quoteModal');
    if(!overlay) return;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    track('quote_form_started', {page: location.pathname, prefilled_service: prefillService || null});
    if(prefillService){
      selectedService = prefillService;
      const btn = overlay.querySelector(`.service-pick button[data-service="${prefillService}"]`);
      if(btn){
        overlay.querySelectorAll('.service-pick button').forEach(b=>b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
      }
      goToStep(2);
    } else {
      goToStep(1);
    }
  }

  function close(){
    const overlay = document.getElementById('quoteModal');
    if(!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function goToStep(step){
    currentStep = step;
    document.querySelectorAll('.modal-step').forEach(el=>{
      el.classList.toggle('is-active', Number(el.dataset.step) === step);
    });
    document.querySelectorAll('.modal__steps span').forEach((el,i)=>{
      el.classList.toggle('is-done', i < step);
    });
    if(step === 3){
      fillReview();
    }
  }

  function selectService(btn){
    document.querySelectorAll('.service-pick button').forEach(b=>b.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    selectedService = btn.dataset.service;
    track('service_selected', {page: location.pathname, service: selectedService, context: 'quote_modal'});
  }

  function fillReview(){
    const box = document.getElementById('reviewBox');
    if(!box) return;
    const name = document.getElementById('qName').value || '—';
    const phone = document.getElementById('qPhone').value || '—';
    const email = document.getElementById('qEmail').value || '—';
    const location = document.getElementById('qLocation').value || '—';
    const propertyType = document.getElementById('qPropertyType').value || '—';
    const date = document.getElementById('qDate').value || '—';
    const time = document.getElementById('qTime').value || '—';
    const notes = document.getElementById('qNotes').value || '—';
    box.innerHTML = `
      <p><strong>Service:</strong> ${selectedService || '—'}</p>
      <p><strong>Name:</strong> ${name} &nbsp; | &nbsp; <strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Location:</strong> ${location} &nbsp; | &nbsp; <strong>Property:</strong> ${propertyType}</p>
      <p><strong>Preferred:</strong> ${date} ${time}</p>
      <p><strong>Notes:</strong> ${notes}</p>
    `;
  }

  function submit(){
    track('quote_form_submitted', {page: location.pathname, service: selectedService});
    goToStep(4);
  }

  function reset(){
    document.querySelectorAll('.service-pick button').forEach(b=>b.classList.remove('is-selected'));
    selectedService = null;
    document.querySelectorAll('.modal input, .modal select, .modal textarea').forEach(el=> el.value = '');
    goToStep(1);
  }

  return {open, close, goToStep, selectService, submit, reset, getSelectedService: ()=>selectedService};
})();

function initQuoteModal(){
  const overlay = document.getElementById('quoteModal');
  if(!overlay) return;

  document.querySelectorAll('[data-open-quote]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      const svc = el.getAttribute('data-open-quote') || null;
      QuoteModal.open(svc && svc !== 'true' ? svc : null);
    });
  });

  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay) QuoteModal.close();
  });
  overlay.querySelector('.modal__close').addEventListener('click', ()=> QuoteModal.close());

  overlay.querySelectorAll('.service-pick button').forEach(btn=>{
    btn.addEventListener('click', ()=> QuoteModal.selectService(btn));
  });

  overlay.querySelectorAll('[data-next]').forEach(btn=>{
    btn.addEventListener('click', ()=> QuoteModal.goToStep(Number(btn.dataset.next)));
  });
  overlay.querySelectorAll('[data-back]').forEach(btn=>{
    btn.addEventListener('click', ()=> QuoteModal.goToStep(Number(btn.dataset.back)));
  });
  const submitBtn = overlay.querySelector('[data-submit]');
  submitBtn && submitBtn.addEventListener('click', ()=> QuoteModal.submit());
  const doneBtn = overlay.querySelector('[data-done]');
  doneBtn && doneBtn.addEventListener('click', ()=>{ QuoteModal.reset(); QuoteModal.close(); });
}

/* ---------------- Quick quote chips (homepage) ---------------- */
function initQuickChips(){
  document.querySelectorAll('.chip-row .chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      document.querySelectorAll('.chip-row .chip').forEach(c=>c.classList.remove('is-active'));
      chip.classList.add('is-active');
      track('service_selected', {page: location.pathname, service: chip.dataset.service, context: 'quick_quote'});
    });
  });
  const goBtn = document.getElementById('quickQuoteGo');
  if(goBtn){
    goBtn.addEventListener('click', ()=>{
      const active = document.querySelector('.chip-row .chip.is-active');
      QuoteModal.open(active ? active.dataset.service : null);
    });
  }
}

/* ---------------- Before / after slider ---------------- */
function initBeforeAfter(){
  document.querySelectorAll('.ba-slider').forEach(slider=>{
    const after = slider.querySelector('.ba-slider__after');
    const handle = slider.querySelector('.ba-slider__handle');
    let dragging = false;

    const setPos = (clientX)=>{
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(4, Math.min(96, pct));
      after.style.clipPath = `inset(0 ${100-pct}% 0 0)`;
      handle.style.left = pct + '%';
    };

    handle.addEventListener('pointerdown', (e)=>{ dragging = true; handle.setPointerCapture(e.pointerId); });
    window.addEventListener('pointermove', (e)=>{ if(dragging) setPos(e.clientX); });
    window.addEventListener('pointerup', ()=> dragging = false);
    slider.addEventListener('click', (e)=> setPos(e.clientX));
  });
}

/* ---------------- Gallery filter ---------------- */
function initGalleryFilter(){
  const tabs = document.querySelectorAll('.gallery-tab');
  const items = document.querySelectorAll('.gallery-item');
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.forEach(t=>t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const cat = tab.dataset.cat;
      items.forEach(item=>{
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initWhatsappLinks();
  initContactClickTracking();
  initCtaClickTracking();
  initNavScroll();
  initMobileMenu();
  initQuoteModal();
  initQuickChips();
  initBeforeAfter();
  initGalleryFilter();
});
