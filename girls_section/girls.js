// girls.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('g-products');
  const cat = document.getElementById('g-filter-category');
  const age = document.getElementById('g-filter-age');
  const price = document.getElementById('g-filter-price');
  const apply = document.getElementById('g-apply');
  const reset = document.getElementById('g-reset');
  const loaderId = 'girls-loader';

  function matches(card) {
    const c = card.dataset.category || '';
    const a = card.dataset.age || '';
    const p = parseFloat(card.dataset.price || '0');

    if (cat.value !== 'all' && c !== cat.value) return false;
    if (age.value !== 'all' && a !== age.value) return false;
    if (price.value !== 'all') {
      const [minS, maxS] = price.value.split('-');
      const min = parseFloat(minS), max = parseFloat(maxS || 999999);
      if (!(p >= min && p <= max)) return false;
    }
    return true;
  }

  function applyFilters() {
    showLoader(loaderId);
    setTimeout(()=> {
      container.querySelectorAll('.product-card').forEach(card => {
        card.style.display = matches(card) ? '' : 'none';
      });
      hideLoader(loaderId);
      refreshRevealFor('#g-products');
      apply.classList.add('pulse');
      setTimeout(()=> apply.classList.remove('pulse'), 520);
    }, 160);
  }

  function resetFilters() { cat.value = 'all'; age.value = 'all'; price.value = 'all'; applyFilters(); }
  apply.addEventListener('click', applyFilters);
  reset.addEventListener('click', resetFilters);

  container.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.add-to-cart');
    if (!btn) return;
    const id = parseInt(btn.dataset.id,10);
    const card = btn.closest('.product-card');
    const name = card.querySelector('h3').textContent;
    const price = parseFloat(card.dataset.price);
    const imgEl = card.querySelector('img');
    const img = imgEl ? imgEl.src : '';
    addToCart({ id, name, price, img });
    if (imgEl) animateAddToCart(imgEl);
  });

  setTimeout(()=> staggerReveal('#g-products'), 120);
});
