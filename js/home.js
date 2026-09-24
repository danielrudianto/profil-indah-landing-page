/* Beranda: animasi muncul saat di-scroll dan akordeon "Merek yang kami sediakan".
   Porting dari logika komponen di desain. Scrollspy di skrip desain tidak dibawa:
   sejak nav baru (Beranda/Produk) tidak ada lagi elemen .pi-spy yang bisa ditandai. */
(function () {
  function setupAos() {
    var hero = document.querySelector('section');
    var groups = ['.pi-stats > div', '.pi-catgrid > a', '.pi-steps > div'];
    var singles = ['section h2', 'section > span', '.pi-brandrow', '.pi-herogrid > figure', '.pi-herogrid > div', '.pi-2col > div', '.pi-2col > p'];
    var els = [];
    // Hero punya animasi masuk sendiri (.pi-rise); jangan dianimasikan dua kali.
    var add = function (el) { if (hero && hero.contains(el)) return; if (el.closest('.pi-rise')) return; if (els.indexOf(el) < 0) els.push(el); };
    groups.forEach(function (sel) { document.querySelectorAll(sel).forEach(function (el, i) { el.style.animationDelay = ((i % 3) * 0.09) + 's'; add(el); }); });
    singles.forEach(function (sel) { document.querySelectorAll(sel).forEach(add); });
    var vh = function () { return window.innerHeight || document.documentElement.clientHeight; };
    // Yang sudah terlihat saat halaman dibuka tidak disembunyikan, supaya tidak berkedip.
    var pending = els.filter(function (el) { return el.getBoundingClientRect().top > vh() * 0.92; });
    pending.forEach(function (el) { el.classList.add('pi-aos'); });
    var check = function () {
      var limit = vh() * 0.9;
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top < limit) { el.classList.add('is-in'); return false; }
        return true;
      });
      if (!pending.length) {
        document.removeEventListener('scroll', check, { capture: true });
        window.removeEventListener('resize', check);
      }
    };
    document.addEventListener('scroll', check, { capture: true, passive: true });
    window.addEventListener('resize', check);
    check();
  }

  /* ---- Akordeon merek ----
     Isi (nama, deskripsi, kategori, sumber gambar) ada di HTML; di sini hanya gaya
     buka/tutup. Gaya ditulis sebagai string yang sama persis dengan desain agar
     transisinya identik. */
  var SHARED = 'position: relative; border: 2px solid color-mix(in srgb, var(--color-bg) 16%, transparent); cursor: pointer; overflow: hidden; display: flex; text-align: left; flex-shrink: 1; flex-basis: 78px; transition: flex-grow 0.55s cubic-bezier(0.22, 0.72, 0.18, 1), background 0.4s, border-color 0.4s, padding 0.45s cubic-bezier(0.22, 0.72, 0.18, 1);';
  var COLLAPSED_BASE = SHARED + ' flex-grow: 0; align-items: flex-end; justify-content: center; padding: 24px 0;';
  var VERT = 'position: relative; writing-mode: vertical-rl; transform: rotate(180deg); font-family: var(--font-heading); font-weight: var(--font-heading-weight); font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;';

  function brandStyles(photo, logo, open) {
    var onPhoto = open && !!photo;
    var collapsed = COLLAPSED_BASE + (photo
      ? ' background-image: url(' + photo + '); background-size: cover; background-position: center; color: var(--color-bg);'
      : ' background: var(--color-bg); color: var(--color-text);');
    var expanded = SHARED + ' flex-grow: 1; cursor: default; align-items: flex-end; justify-content: flex-start; padding: clamp(20px, 2.6vw, 36px); border-color: var(--color-neutral-500);'
      + (photo
        ? ' background-image: url(' + photo + '); background-size: cover; background-position: center; color: var(--color-bg);'
        : ' background: var(--color-neutral-100); color: var(--color-text);');
    // Teks panel muncul bergiliran; d = jeda dalam detik.
    var reveal = function (d) {
      return open
        ? ' opacity: 1; transform: none; transition: opacity 0.5s ' + d + 's cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.55s ' + d + 's cubic-bezier(0.2, 0.7, 0.2, 1);'
        : ' opacity: 0; transform: translateX(-14px);';
    };
    var ink = onPhoto ? 'var(--color-bg)' : 'var(--color-text)';
    var muted = onPhoto ? 'var(--color-bg)' : 'color-mix(in srgb, var(--color-text) 76%, transparent)';
    return {
      card: open ? expanded : collapsed,
      scrim: photo
        ? 'position: absolute; inset: 0; transition: background 0.55s cubic-bezier(0.22, 0.72, 0.18, 1); background: ' + (open
            ? 'linear-gradient(100deg, color-mix(in srgb, #201e1d 90%, transparent) 0%, color-mix(in srgb, #201e1d 66%, transparent) 52%, color-mix(in srgb, #201e1d 22%, transparent) 100%)'
            : 'linear-gradient(100deg, color-mix(in srgb, #201e1d 72%, transparent) 0%, color-mix(in srgb, #201e1d 60%, transparent) 100%)') + ';'
        : 'display: none;',
      vert: open ? 'display: none;' : VERT,
      panel: open
        ? 'position: relative; width: 100%;'
        : 'position: absolute; width: 0; opacity: 0; overflow: hidden; pointer-events: none;',
      logo: onPhoto
        ? 'display: none;'
        : 'height: 28px; width: 150px; display: block; margin: 0 0 28px; background-image: url(' + logo + '); background-repeat: no-repeat; background-position: left center; background-size: contain;' + reveal(0.26),
      title: 'font-size: clamp(22px, 2.4vw, 30px); line-height: 1.12; letter-spacing: -0.02em; margin: 0 0 14px; color: ' + ink + ';' + reveal(0.32),
      desc: 'font-size: 15px; line-height: 1.7; margin: 0 0 18px; max-width: 44ch; color: ' + muted + ';' + reveal(0.4),
      cat: 'display: block; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ' + (onPhoto ? 'var(--color-bg)' : 'var(--color-accent-700)') + ';' + reveal(0.48),
      credit: onPhoto
        ? 'display: block; font-size: 12px; letter-spacing: 0.04em; margin-top: 20px; color: var(--color-bg);' + reveal(0.56)
        : 'display: none;'
    };
  }

  function selectBrand(buttons, index) {
    buttons.forEach(function (btn, n) {
      var open = n === index;
      var s = brandStyles(btn.getAttribute('data-photo'), btn.getAttribute('data-logo'), open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.style.cssText = s.card;
      btn.querySelector('.pi-brand-scrim').style.cssText = s.scrim;
      btn.querySelector('.pi-vert').style.cssText = s.vert;
      btn.querySelector('.pi-brand-panel').style.cssText = s.panel;
      btn.querySelector('.pi-brand-logo').style.cssText = s.logo;
      btn.querySelector('.pi-brand-title').style.cssText = s.title;
      btn.querySelector('.pi-brand-desc').style.cssText = s.desc;
      btn.querySelector('.pi-brand-cat').style.cssText = s.cat;
      btn.querySelector('.pi-brand-credit').style.cssText = s.credit;
    });
  }

  function init() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.pi-brandrow > .pi-brand'));
    selectBrand(buttons, 0);
    buttons.forEach(function (btn, n) {
      btn.addEventListener('click', function () { selectBrand(buttons, n); });
    });

    // Datang dari halaman lain dengan #kontak dsb.: scroll halus setelah gambar sempat memuat.
    setTimeout(function () {
      var id = (location.hash || '').slice(1);
      if (id && document.getElementById(id) && window.__piScrollTo) window.__piScrollTo(id);
    }, 500);
    setTimeout(setupAos, 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
