/* Dipakai semua halaman: scroll halus ke #anchor dan fade saat pindah halaman.
   Porting dari skrip bersama di desain Claude Design. Fungsi __piAos dari desain
   sengaja tidak dibawa: Produk dan Kategori memanggilnya, tapi keduanya tidak
   punya CSS .pi-aos, jadi di desain pun tidak ada efek yang terlihat. */
(function () {
  window.__piScrollTo = function (id) {
    var t = document.getElementById(id);
    if (!t) return;
    // Offset setinggi nav sticky; tanpa ini judul section tertutup nav.
    var nav = document.querySelector('nav.nav');
    var off = (nav ? nav.getBoundingClientRect().height : 0) + 8;
    var y = Math.max(0, t.getBoundingClientRect().top + window.pageYOffset - off);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { window.scrollTo(0, y); return; }
    var start = window.pageYOffset, dist = y - start, dur = Math.min(1400, Math.max(700, Math.abs(dist) * 0.45)), t0 = null;
    var ease = function (x) { return 1 - Math.pow(1 - x, 4); };
    var step = function (ts) { if (t0 === null) t0 = ts; var p = Math.min(1, (ts - t0) / dur); window.scrollTo(0, start + dist * ease(p)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var href = a.getAttribute('href');
    if (href && href.charAt(0) === '#' && href.length > 1) {
      if (!document.getElementById(href.slice(1))) return;
      e.preventDefault();
      if (history.replaceState) history.replaceState(null, '', href);
      window.__piScrollTo(href.slice(1));
      return;
    }
    if (!href || /^(https?:|tel:|mailto:)/.test(href)) return;
    // Klik ke halaman yang sedang dibuka tidak diberi fade, sama seperti di desain.
    // Alamat dibandingkan dalam bentuk bersih: "/", "index", dan "index.html" sama-sama
    // beranda; "produk" sama dengan "produk.html".
    var norm = function (p) { p = p.split('/').pop().replace(/\.html$/, ''); return p === 'index' ? '' : p; };
    if (norm(href.split('#')[0]) === norm(location.pathname)) return;
    e.preventDefault();
    document.body.classList.add('pi-leaving');
    setTimeout(function () { location.href = a.href; }, 380);
  });

  // Kembali dengan tombol Back memulihkan halaman dari cache dalam keadaan pudar.
  window.addEventListener('pageshow', function () { document.body.classList.remove('pi-leaving'); });
})();
