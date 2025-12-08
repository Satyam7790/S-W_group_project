// cart.js - render cart and wire quantity/remove
document.addEventListener('DOMContentLoaded', () => {
  const items = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const emptyEl = document.getElementById('cart-empty');
  const checkout = document.getElementById('checkout');

  function esc(s){ return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  function render() {
    const cart = getCart();
    items.innerHTML = '';
    if (!cart || cart.length === 0) {
      emptyEl.style.display = 'block';
      totalEl.textContent = '';
      return;
    }
    emptyEl.style.display = 'none';
    let total = 0;
    cart.forEach(it => {
      total += (it.price * (it.qty||1));
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div class="cart-img"><img src="${esc(it.img||'https://placehold.co/80x80?text=No')}" alt=""></div>
        <div class="cart-name">${esc(it.name)}</div>
        <div class="cart-qty">
          <button class="qty-btn dec" data-id="${it.id}">-</button>
          <div class="qty-num">${it.qty}</div>
          <button class="qty-btn inc" data-id="${it.id}">+</button>
        </div>
        <div class="cart-price">$${(it.price * it.qty).toFixed(2)}</div>
        <button class="remove-btn" data-id="${it.id}">Remove</button>
      `;
      items.appendChild(row);
    });
    totalEl.textContent = `Total: $${total.toFixed(2)}`;

    // wire
    items.querySelectorAll('.inc').forEach(btn => btn.addEventListener('click', ()=> changeQty(parseInt(btn.dataset.id), +1)));
    items.querySelectorAll('.dec').forEach(btn => btn.addEventListener('click', ()=> changeQty(parseInt(btn.dataset.id), -1)));
    items.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', ()=> removeItem(parseInt(btn.dataset.id))));
  }

  function changeQty(id, delta) {
    const cart = getCart();
    const it = cart.find(i=>i.id===id);
    if (!it) return;
    it.qty = (it.qty||1) + delta;
    if (it.qty <= 0) {
      const row = document.querySelector(`.remove-btn[data-id="${id}"]`)?.closest('.cart-row');
      if (row) { row.classList.add('removing'); setTimeout(()=> { const next = getCart().filter(i=>i.id!==id); saveCart(next); render(); }, 320); }
      else { saveCart(cart.filter(i=>i.id!==id)); render(); }
      return;
    }
    saveCart(cart);
    // pulse price
    const priceEl = document.querySelector(`.remove-btn[data-id="${id}"]`)?.closest('.cart-row')?.querySelector('.cart-price');
    if (priceEl){ priceEl.classList.add('pulse'); setTimeout(()=> priceEl.classList.remove('pulse'), 420); }
    render();
  }

  function removeItem(id) {
    const row = document.querySelector(`.remove-btn[data-id="${id}"]`)?.closest('.cart-row');
    if (row) { row.classList.add('removing'); setTimeout(()=> { saveCart(getCart().filter(i=>i.id!==id)); render(); }, 320); }
    else { saveCart(getCart().filter(i=>i.id!==id)); render(); }
  }

  checkout.addEventListener('click', ()=> {
    const cart = getCart();
    if (!cart || cart.length===0) { alert('Cart empty'); return; }
    alert('Demo checkout complete — thank you!');
    saveCart([]); render();
  });

  render();
});
