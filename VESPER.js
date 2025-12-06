/* ---------- Cart count state ---------- */
const CART_KEY = 'vesper_cart_count';
const cartCountEl = document.getElementById('cartCount');
const cartLinkEl  = document.getElementById('cartLink');
const cartSummary = document.getElementById('cartSummary');

function getCartCount(){
  return parseInt(localStorage.getItem(CART_KEY) || '0', 10);
}
function setCartCount(n){
  localStorage.setItem(CART_KEY, String(n));
  updateCartBadge();
}
function updateCartBadge(){
  const n = getCartCount();
  if (cartCountEl && cartLinkEl){
    cartCountEl.textContent = n;
    if (n > 0){
      cartCountEl.classList.add('show');
      cartLinkEl.setAttribute('aria-label', `Cart (${n})`);
    } else {
      cartCountEl.classList.remove('show');
      cartLinkEl.setAttribute('aria-label', 'Cart (0)');
    }
  }
  if (cartSummary){
    cartSummary.textContent = n > 0
      ? `Þú hefur ${n} vöru${n>1?'r':''} í körfunni — greiðsla kemur fljótlega.`
      : 'Karfan þín er tóm — greiðsla kemur fljótlega.';
  }
}
/* ---------- Clear cart button ---------- */
const clearBtn = document.getElementById('clearCart');
if (clearBtn){
  clearBtn.addEventListener('click', () => {
    // Optional confirm:
    // if (!confirm('Clear all items from your cart?')) return;
    setCartCount(0);
  });
}

// init on load
updateCartBadge();

/* ---------- BUY NOW adds to cart ---------- */
const buyBtn = document.getElementById('buyNow');
if (buyBtn){
  buyBtn.addEventListener('click', () => {
    const product = document.getElementById('product');
    if (product) product.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ---------- (Keep your existing hamburger + smooth scroll code below) ---------- */



/* ---------------- Hamburger menu ---------------- */
const menuBtn   = document.getElementById('menuBtn');
const sideMenu  = document.getElementById('sideMenu');
const scrim     = document.getElementById('menuScrim');
const closeBtn  = document.getElementById('closeMenu');

function openMenu(){
  sideMenu.setAttribute('aria-hidden','false');
  menuBtn.setAttribute('aria-expanded','true');
  const firstLink = sideMenu.querySelector('.menu-link');
  if(firstLink) firstLink.focus();
  sideMenu.style.pointerEvents = 'auto';
}
function closeMenu(){
  sideMenu.setAttribute('aria-hidden','true');
  menuBtn.setAttribute('aria-expanded','false');
  sideMenu.style.pointerEvents = 'none';
  menuBtn.focus();
}

menuBtn.addEventListener('click', () => {
  const isOpen = sideMenu.getAttribute('aria-hidden') === 'false';
  isOpen ? closeMenu() : openMenu();
});
closeBtn.addEventListener('click', closeMenu);
scrim.addEventListener('click', closeMenu);

// Close on Escape
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && sideMenu.getAttribute('aria-hidden') === 'false'){
    closeMenu();
  }
});

/* --------- Contact form (Formspree) --------- */
const formEl   = document.getElementById('contactForm');
const alertEl  = document.getElementById('formAlert');
const submitEl = document.getElementById('contactSubmit');

function showAlert(kind, msg){
  if (!alertEl) return;
  alertEl.hidden = false;
  alertEl.className = 'alert'; // reset
  if (kind === 'success') alertEl.classList.add('alert--success');
  else if (kind === 'error') alertEl.classList.add('alert--error');
  else alertEl.classList.add('alert--info');
  alertEl.textContent = msg;
}

if (formEl){
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side check
    if (!formEl.checkValidity()){
      showAlert('Úps', 'Endilega fylltu út öll nauðsynleg svæði.');
      return;
    }

    try {
      submitEl?.setAttribute('disabled', 'true');
      showAlert('info', 'Sending…');

      const res = await fetch(formEl.action, {
        method: 'POST',
        body: new FormData(formEl),
        headers: { 'Accept': 'application/json' }  // tells Formspree we expect JSON (no redirect)
      });

      if (res.ok){
        showAlert('Komið', 'Skilaboð send! Við munum hafa samband við þig fljótlega.');
        formEl.reset();
      } else {
        // Try to read Formspree error details
        let msg = 'Eitthvað fór úrskeiðis. Vinsamlegast reyndu aftur.';
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length){
            msg = data.errors.map(e => e.message).join(' ');
          }
        } catch {}
        showAlert('error', msg);
      }
    } catch (err) {
      console.error(err);
      showAlert('Úps', 'Netkerfi villa. Vinsamlegast reyndu aftur.');
    } finally {
      submitEl?.removeAttribute('disabled');
    }
  });
}


  

/* ---------------- Footer year ---------------- */
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for in-menu anchor links
document.querySelectorAll('.menu-link[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    // close the slide-over first
    if (typeof closeMenu === 'function') closeMenu();

    // native smooth scroll; offset handled by CSS scroll-margin-top
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // optional: update URL hash without jumping
    history.replaceState(null, '', '#' + id);
  });
});

// Simple slideshow
(function(){
  const container = document.querySelector('#product .slides');
  if (!container) return;

  const slides = [...container.querySelectorAll('.slide')];
  if (slides.length === 0) return;

  let i = slides.findIndex(s => s.classList.contains('is-active'));
  if (i < 0) i = 0;

  function show(n){
    slides[i].classList.remove('is-active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
  }

  const prevBtn = document.querySelector('#product .prev');
  const nextBtn = document.querySelector('#product .next');
  prevBtn?.addEventListener('click', () => show(i - 1));
  nextBtn?.addEventListener('click', () => show(i + 1));

  // Keyboard support when gallery is focused
  document.querySelector('#product .gallery')?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();

// Price (set from a variable so you can change in one place)
const PRICE_ISK = 19900; // <-- set your price here
const priceEl = document.getElementById('priceValue');
if (priceEl){
  priceEl.textContent = PRICE_ISK.toLocaleString('is-IS');
}

// Add to cart (increments and updates badge/checkout button)
const addBtn = document.getElementById('addToCart');
if (addBtn){
  addBtn.addEventListener('click', () => {
    const n = getCartCount() + 1;
    setCartCount(n);
    if (typeof updateCheckoutBtn === 'function') updateCheckoutBtn();
  });
}

