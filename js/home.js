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

  function brandStyles(photo, logo, open, openWidth) {
    var onPhoto = open && !!photo;
    // Foto tidak lagi menjadi background kartu. Dengan background-size: cover, browser
    // menskalakan ulang foto di setiap frame selama kartu melebar: itu yang terlihat
    // seperti zoom dan membuat animasi patah-patah. Foto dipindah ke .pi-brand-img (lihat imgStyle).
    // Mode tumpuk (openWidth null, layar sempit): kartu tidak dianimasikan melebar, jadi
    // dipakai cara desain apa adanya (foto sebagai background kartu) supaya tampilannya identik.
    var photoOnCard = ' background-image: url(' + photo + '); background-size: cover; background-position: center; color: var(--color-bg);';
    var photoOnLayer = ' background: var(--color-neutral-800); color: var(--color-bg);';
    var photoBg = openWidth ? photoOnLayer : photoOnCard;
    var collapsed = COLLAPSED_BASE + (photo ? photoBg : ' background: var(--color-bg); color: var(--color-text);');
    var expanded = SHARED + ' flex-grow: 1; cursor: default; align-items: flex-end; justify-content: flex-start; padding: clamp(20px, 2.6vw, 36px); border-color: var(--color-neutral-500);'
      + (photo ? photoBg : ' background: var(--color-neutral-100); color: var(--color-text);');
    // Teks panel muncul bergiliran; d = jeda dalam detik.
    var reveal = function (d) {
      return open
        ? ' opacity: 1; transform: none; transition: opacity 0.5s ' + d + 's cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.55s ' + d + 's cubic-bezier(0.2, 0.7, 0.2, 1);'
        : ' opacity: 0; transform: translateX(-14px);';
    };
    var ink = onPhoto ? 'var(--color-bg)' : 'var(--color-text)';
    var muted = onPhoto ? 'var(--color-bg)' : 'color-mix(in srgb, var(--color-text) 76%, transparent)';
    // Efek "push": lebar foto dikunci selebar kartu saat terbuka penuh dan diletakkan di
    // tengah kartu. Kartu yang melebar hanya membuka lebih banyak bagian foto dan mendorong
    // kartu lain, tanpa mengubah skala foto. will-change menaruh foto di layer sendiri
    // sehingga tidak digambar ulang tiap frame. Di mode tumpuk layer ini tidak dipakai.
    var img = (!photo || !openWidth) ? 'display: none;'
      : 'position: absolute; top: 0; bottom: 0; left: 50%; width: ' + openWidth + 'px; transform: translate3d(-50%, 0, 0); will-change: transform;'
        + ' background-image: url(' + photo + '); background-size: cover; background-position: center; background-repeat: no-repeat; pointer-events: none;';
    return {
      img: img,
      card: open ? expanded : collapsed,
      // Scrim ikut dikunci selebar foto (bukan inset: 0) supaya gradiennya tidak
      // digambar ulang tiap frame saat kartu melebar.
      scrim: photo
        ? (openWidth
            ? 'position: absolute; top: 0; bottom: 0; left: 50%; width: ' + openWidth + 'px; transform: translate3d(-50%, 0, 0); will-change: transform;'
            : 'position: absolute; inset: 0;')
          + ' transition: background 0.55s cubic-bezier(0.22, 0.72, 0.18, 1); background: ' + (open
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

  // Lebar kartu terbuka = lebar baris dikurangi kartu tertutup (78px) dan celah (2px),
  // angka yang sama dengan flex-basis dan gap di markup desain. Di bawah 820px kartu
  // ditumpuk vertikal oleh CSS desain, jadi tidak ada lebar tetap.
  var STACK_MQ = window.matchMedia('(max-width: 820px)');
  function openWidthFor(buttons) {
    if (STACK_MQ.matches || !buttons.length) return null;
    var row = buttons[0].parentNode;
    var n = buttons.length;
    // Dikurangi 4px lagi: bingkai 2px kiri-kanan. Foto dan scrim berada di dalam bingkai,
    // dan di desain skala foto dihitung dari bagian dalam itu; tanpa -4 foto 0,5% kebesaran.
    // Pakai lebar pecahan dari getBoundingClientRect, bukan clientWidth yang dibulatkan:
    // selisih 0,1px saja menggeser foto sub-piksel sehingga seluruh foto ikut buram tipis.
    var w = row.getBoundingClientRect().width - (n - 1) * 78 - (n - 1) * 2 - 4;
    return Math.max(0, Math.round(w * 100) / 100);
  }

  function selectBrand(buttons, index) {
    var w = openWidthFor(buttons);
    buttons.forEach(function (btn, n) {
      var open = n === index;
      var s = brandStyles(btn.getAttribute('data-photo'), btn.getAttribute('data-logo'), open, w);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.style.cssText = s.card;
      btn.querySelector('.pi-brand-img').style.cssText = s.img;
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
    var current = 0;
    selectBrand(buttons, current);
    buttons.forEach(function (btn, n) {
      btn.addEventListener('click', function () { current = n; selectBrand(buttons, n); });
    });
    // Lebar foto mengikuti lebar baris; hitung ulang saat jendela berubah ukuran.
    var rt = null;
    // Juga saat melewati batas 820px, karena cara pasang foto berganti antara dua mode.
    if (STACK_MQ.addEventListener) STACK_MQ.addEventListener('change', function () { selectBrand(buttons, current); });
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { selectBrand(buttons, current); }, 100);
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
