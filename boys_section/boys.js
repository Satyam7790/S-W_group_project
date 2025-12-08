// boys.js
document.addEventListener('DOMContentLoaded', () => {
  const category = document.getElementById('filter-category');
  const age = document.getElementById('filter-age');
  const price = document.getElementById('filter-price');
  const badge = document.getElementById('filter-badge');
  const apply = document.getElementById('applyFilters');
  const reset = document.getElementById('resetFilters');
  const list = document.getElementById('product-list');
  const loaderId = 'boys-loader';

  function passes(card) {
    const c = card.dataset.category || '';
    const a = card.dataset.age || '';
    const p = parseFloat(card.dataset.price || '0');
    const b = card.dataset.badge || '';

    if (category.value !== 'all' && c !== category.value) return false;
    if (age.value !== 'all' && a !== age.value) return false;
    if (badge.value !== 'all' && b !== badge.value) return false;
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
      list.querySelectorAll('.product-card').forEach(card => {
        card.style.display = passes(card) ? '' : 'none';
      });
      hideLoader(loaderId);
      refreshRevealFor('#product-list');
      apply.classList.add('pulse');
      setTimeout(()=> apply.classList.remove('pulse'), 520);
    }, 160);
  }

  function resetFilters() {
    category.value = 'all'; age.value = 'all'; price.value = 'all'; badge.value = 'all';
    applyFilters();
  }

  apply.addEventListener('click', applyFilters);
  reset.addEventListener('click', resetFilters);

  // add to cart with fly animation
  list.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart');
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

  // initial reveal
  setTimeout(()=> staggerReveal('#product-list'), 120);
});
