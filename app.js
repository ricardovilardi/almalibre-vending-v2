// Almalibre v2 — clickable prototype of the NonStop machine flow.
// Backgrounds are the production exports in export/; everything drawn on top imitates the provider's app.

const PRICE_BASE = 4.5;   // bowl base (placeholder)
const PRICE_EXTRA = 1.0;  // each topping (placeholder)
const IDLE_MS = 45000;

// 6 toppings on screen: 3 solids + 3 liquids. The 3rd liquid is a per-machine slot.
const TOPPINGS = {
  granola:  { type: 'solid',  name: 'Granola crunchy', img: 'assets/t-granola.png' },
  oreo:     { type: 'solid',  name: 'Oreo', img: 'assets/t-oreo.png' },
  pacoca:   { type: 'solid',  name: 'Paçoca (Cacahuete dulce)', img: 'assets/t-pacoca.png' },
  frutos:   { type: 'liquid', name: 'Salsa de frutos rojos', img: 'assets/t-frutos.png' },
  choco:    { type: 'liquid', name: 'Chocolate blanco y nocciola', img: 'assets/t-choco.png' },
  pistacho: { type: 'liquid', name: 'Crema de pistacho', img: 'assets/t-pistacho.png' },
  crema:    { type: 'liquid', name: 'Crema de cacahuete, cacao y avellana', img: 'assets/t-crema.png' },
};
const SLOT_OPTIONS = ['pistacho', 'crema'];

// Placeholder content for the product image/video slot on the Personaliza screen
const SLIDES = [
  { bg: 'assets/attract-poster.jpg', h: 'Açaí desde el corazón de la Amazonia', p: '100 % natural' },
  { img: 'assets/cup.png', h: 'Tu bowl de açaí en segundos', p: 'Fresco, cremoso y a tu manera' },
  { img: 'assets/t-frutos.png', h: 'Tú eliges tus toppings', p: 'Todos los que quieras' },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const eur = n => n.toFixed(2).replace('.', ',') + ' €';

const state = { slot: 'pistacho', welcome: 'vanille', picked: new Set(), bowls: 1, screen: 'attract' };
const menu = () => ['granola', 'oreo', 'pacoca', 'frutos', 'choco', state.slot];
const unit = () => PRICE_BASE + state.picked.size * PRICE_EXTRA;
const total = () => unit() * state.bowls;
const bowlsLabel = n => `${n} ${n === 1 ? 'bowl' : 'bowls'}`;

/* ---------- scaling ---------- */
function fit() {
  const wrap = $('.stage-wrap'), k = $('#kiosk');
  const s = Math.min(wrap.clientWidth / 1080, wrap.clientHeight / 1920) * 0.96;
  k.style.transform = `translate(-50%,-50%) scale(${s})`;
}
addEventListener('resize', fit);

/* ---------- navigation ---------- */
let idleTimer, slideTimer, makeTimer;
function go(name) {
  clearTimeout(makeTimer);
  state.screen = name;
  $$('.screen').forEach(s => s.classList.toggle('active', s.dataset.screen === name));
  const v = $('#attractVideo');
  name === 'attract' ? (v.currentTime = 0, v.play().catch(() => {})) : v.pause();
  if (name === 'attract') { state.picked.clear(); state.bowls = 1; }
  if (name === 'welcome') startCarousel(); else clearInterval(slideTimer);
  if (name === 'book') renderBook();
  if (name === 'order') renderQty();
  if (name === 'payment') renderSummary();
  if (name === 'outing') startMaking();
  bumpIdle();
}
function bumpIdle() {
  clearTimeout(idleTimer);
  if (!['attract', 'outing', 'soldout'].includes(state.screen)) idleTimer = setTimeout(() => go('attract'), IDLE_MS);
}
document.addEventListener('pointerdown', bumpIdle);
document.addEventListener('click', e => {
  const t = e.target.closest('[data-go]');
  if (t) go(t.dataset.go);
});
$('[data-screen="attract"]').addEventListener('click', () => go('welcome'));

/* ---------- Personaliza ---------- */
function startCarousel() {
  $('#welcomeBg').src = `export/onctuo_label_welcome_${state.welcome}_en.jpg`;
  const c = $('#carousel');
  c.innerHTML = SLIDES.map(s => `<div class="slide" style="${s.bg ? `background-image:url(${s.bg})` : ''}">
      ${s.img ? `<img src="${s.img}" alt="">` : ''}<h3>${s.h}</h3><p>${s.p}</p></div>`).join('');
  let i = 0; const sl = $$('.slide', c); sl[0].classList.add('on');
  clearInterval(slideTimer);
  slideTimer = setInterval(() => { sl[i].classList.remove('on'); i = (i + 1) % sl.length; sl[i].classList.add('on'); }, 3500);
}

/* ---------- toppings ---------- */
function card(id) {
  const t = TOPPINGS[id], on = state.picked.has(id);
  return `<button class="card${on ? ' on' : ''}" data-id="${id}" aria-pressed="${on}">
    <img class="mark" src="export/onctuo_bg_diy_selected_mark.png" alt="">
    <div class="ph"><img src="${t.img}" alt=""></div>
    <div class="cap">Imagen ilustrativa</div>
    <div class="nm">${t.name}</div>
    <div class="pr">+${eur(PRICE_EXTRA)}</div></button>`;
}
function renderBook() {
  const m = menu();
  $('#gridSolid').innerHTML = m.filter(id => TOPPINGS[id].type === 'solid').map(card).join('');
  $('#gridLiquid').innerHTML = m.filter(id => TOPPINGS[id].type === 'liquid').map(card).join('');
  $('#bookTotal').textContent = eur(unit());
}
$('.book-scroll').addEventListener('click', e => {
  const c = e.target.closest('.card'); if (!c) return;
  const id = c.dataset.id;
  state.picked.has(id) ? state.picked.delete(id) : state.picked.add(id); // max 1 of each
  renderBook();
});

/* ---------- bowl quantity ---------- */
function renderQty() {
  $('#qty').innerHTML = [1, 2, 3].map(n => `<button class="qopt${state.bowls === n ? ' on' : ''}" data-n="${n}" aria-pressed="${state.bowls === n}">
      <img class="mark" src="export/onctuo_bg_diy_selected_mark.png" alt="">
      <img class="cups" src="assets/bowls-${n}.png" alt="">
      <div class="n">${bowlsLabel(n)}</div></button>`).join('');
  $('#orderTotal').textContent = eur(total());
}
$('#qty').addEventListener('click', e => {
  const b = e.target.closest('.qopt'); if (!b) return;
  state.bowls = +b.dataset.n; renderQty();
});

/* ---------- summary (text only) ---------- */
function renderSummary() {
  $('#sumQty').textContent = bowlsLabel(state.bowls);
  const lines = [`<div class="ln"><span>Bowl de açaí</span><span>${eur(PRICE_BASE)}</span></div>`];
  state.picked.forEach(id => lines.push(`<div class="ln"><span>${TOPPINGS[id].name}</span><span>+${eur(PRICE_EXTRA)}</span></div>`));
  if (state.bowls > 1) lines.push(`<div class="ln"><span>× ${state.bowls} bowls</span><span></span></div>`);
  $('#sumList').innerHTML = lines.join('');
  $('#sumTotal').textContent = eur(total());
}

/* ---------- making ---------- */
function startMaking() {
  $('#ready').hidden = true;
  let step = 1; $('#progress').src = 'export/onctuo_outing_process_1.png';
  const tick = () => {
    step++;
    if (step <= 4) { $('#progress').src = `export/onctuo_outing_process_${step}.png`; makeTimer = setTimeout(tick, 1800); }
    else { $('#ready').hidden = false; makeTimer = setTimeout(() => go('attract'), 4000); }
  };
  makeTimer = setTimeout(tick, 1800);
}

/* ---------- prototype controls ---------- */
$('#slotSelect').addEventListener('change', e => {
  state.slot = e.target.value;
  SLOT_OPTIONS.forEach(id => id !== state.slot && state.picked.delete(id));
  if (state.screen === 'book') renderBook();
  if (state.screen === 'payment') renderSummary();
});

// preload backgrounds
['welcome_vanille_en.jpg', 'book_en.jpg', 'order_en.jpg', 'payment_en.jpg', 'outing_en.jpg', 'sold_out_en.png']
  .forEach(f => { new Image().src = 'export/onctuo_label_' + f; });

fit();
if (location.search.includes('demo')) { state.picked = new Set(['granola', 'frutos', 'pistacho']); state.bowls = 2; }
go(location.hash.slice(1) || 'attract');
if (location.search.includes('demo')) { state.picked = new Set(['granola', 'frutos', 'pistacho']); state.bowls = 2; go(location.hash.slice(1) || 'attract'); }
