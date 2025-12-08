/* script.js - global cart helpers, UI animations, and safe page fade-in
   Include on every page:
   - index.html  -> <script src="script.js"></script>
   - boys/girls  -> <script src="../script.js"></script>
   - cart.html   -> <script src="script.js"></script>
*/

/* ---------------------------
   Safe page fade-in (prevents flash)
   - CSS sets body { opacity: 0 }
   - JS sets opacity = 1 as soon as DOM is ready
   --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Slight delay gives browser time to paint (still feels instant)
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
    document.body.style.transform = 'none';
  });
});

/* ===========================
   CART STORAGE & HELPERS
   =========================== */
const CART_KEY = 'toyStoreCart_v1';
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch(e){ console.warn('Cart parse fail', e); return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function getCartCount() {
  return getCart().reduce((s,i)=>s+(i.qty||0),0);
}
function updateCartCount() {
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = getCartCount());
}

/* addToCart(payload: {id,name,price,img}) */
function addToCart(payload) {
  if (!payload || !payload.id) return;
  const cart = getCart();
  const found = cart.find(i=>i.id === payload.id);
  if (found) found.qty = (found.qty||1) + 1;
  else cart.push({ id: payload.id, name: payload.name, price: payload.price, img: payload.img, qty: 1 });
  saveCart(cart);
  toast(`${payload.name} added to cart`);
}

/* clear for dev */
function clearCart() { saveCart([]); }

/* ===========================
   Small toast
   =========================== */
function toast(msg, ms=1200) {
  if (!msg) return;
  const old = document.getElementById('global-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'global-toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', right:'18px', bottom:'18px', padding:'10px 14px',
    background:'rgba(0,0,0,0.8)', color:'#fff', borderRadius:'8px', zIndex:9999
  });
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), ms);
}

/* ===========================
   Loader helpers (CSS spinner default)
   showLoader('boys-loader'), hideLoader('boys-loader')
   To use a custom GIF: replace inner element in HTML with <img class="loader" src="media/your.gif">
   =========================== */
function showLoader(id) {
  const el = document.getElementById(id); if (el) el.style.display = 'flex';
}
function hideLoader(id) {
  const el = document.getElementById(id); if (el) el.style.display = 'none';
}

/* ===========================
   NAVBAR SHRINK on scroll
   =========================== */
(function navShrink(){
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 36) nav.classList.add('nav-shrink');
    else nav.classList.remove('nav-shrink');
  }, { passive: true });
})();

/* ===========================
   Stagger reveal (cards)
   Usage: staggerReveal('#product-list') or refreshRevealFor('#g-products')
   =========================== */
function staggerReveal(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const cards = container.querySelectorAll('.product-card, .item');
  cards.forEach((card, i) => {
    card.classList.remove('fade-up'); // restart
    card.style.animationDelay = `${i * 70}ms`;
    void card.offsetWidth;
    card.classList.add('fade-up');
  });
}
function refreshRevealFor(selector) {
  const container = document.querySelector(selector);
  if (!container) return;
  container.querySelectorAll('.product-card, .item').forEach(el => {
    el.classList.remove('fade-up');
    void el.offsetWidth;
  });
  staggerReveal(selector);
}

/* ===========================
   Fly to cart animation
   Call animateAddToCart(imgElement)
   =========================== */
function animateAddToCart(imgEl) {
  if (!imgEl) return;
  const cartLink = document.querySelector('a[href$="cart.html"], a[href$="/cart.html"]') || document.querySelector('#cart-count')?.closest('a');
  if (!cartLink) return;

  const imgRect = imgEl.getBoundingClientRect();
  const cartRect = cartLink.getBoundingClientRect();

  const clone = imgEl.cloneNode(true);
  Object.assign(clone.style, {
    position:'fixed', left:`${imgRect.left}px`, top:`${imgRect.top}px`,
    width:`${imgRect.width}px`, height:`${imgRect.height}px`, transition:'transform 700ms cubic-bezier(.2,.9,.3,1), opacity 700ms',
    zIndex:9999, pointerEvents:'none', borderRadius:'6px', objectFit:'cover'
  });
  document.body.appendChild(clone);

  const tx = (cartRect.left + cartRect.width/2) - (imgRect.left + imgRect.width/2);
  const ty = (cartRect.top + cartRect.height/2) - (imgRect.top + imgRect.height/2);

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${tx}px, ${ty}px) scale(0.12) rotate(14deg)`;
    clone.style.opacity = '0.85';
  });

  setTimeout(()=> {
    clone.remove();
    document.querySelectorAll('#cart-count').forEach(el => {
      el.animate([{ transform:'scale(1)' }, { transform:'scale(1.25)' }, { transform:'scale(1)' }], { duration:280, easing:'ease-out' });
    });
  }, 760);
}

/* ===========================
   Ripple effect (delegated)
   =========================== */
(function ripple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .add-to-cart, .small-btn, .apply-btn, .ripple');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ink = document.createElement('span');
    ink.className = 'ripple-ink';
    ink.style.left = `${e.clientX - rect.left}px`;
    ink.style.top  = `${e.clientY - rect.top}px`;
    btn.appendChild(ink);
    setTimeout(()=> ink.remove(), 650);
  });
})();
document.addEventListener('DOMContentLoaded', updateCartCount);
