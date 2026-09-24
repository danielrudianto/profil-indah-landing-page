/* Halaman produk: kartu kategori dibangun dari kategori-data.js.
   Nomor dan daftar item diturunkan dari urutan dan baris data, bukan ditulis ulang. */
(function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // Markup kartu disalin dari template desain; hanya isinya yang diganti.
  document.getElementById('cat-grid').innerHTML = window.PI_CATEGORIES.map(function (c, i) {
    var num = String(i + 1).padStart(2, '0');
    var itemLine = c.rows.map(function (r) { return r[0]; }).join(', ');
    return '<a class="pi-zoom" href="kategori.html#' + esc(c.slug) + '" style="display: block; text-decoration: none; color: var(--color-bg); position: relative; overflow: hidden;">'
      + '<div style="position: relative; aspect-ratio: 4 / 3; overflow: hidden; background: var(--color-neutral-800);">'
      + '<img src="' + esc(c.photo) + '" alt="' + esc(c.alt) + '" style="display: block; width: 100%; height: 100%; object-fit: cover;">'
      + '</div>'
      + '<div style="padding: 20px 0 28px;">'
      + '<p style="font-family: var(--font-heading); font-weight: var(--font-heading-weight); font-size: 13px; margin: 0 0 10px; color: var(--color-neutral-500);">' + num + '</p>'
      + '<h2 style="font-size: 22px; line-height: 1.15; margin: 0 0 8px; font-weight: 500; color: var(--color-bg);">' + esc(c.name) + '</h2>'
      + '<p style="font-size: 14.5px; line-height: 1.6; margin: 0; color: var(--color-neutral-400);">' + esc(itemLine) + '</p>'
      + '</div>'
      + '</a>';
  }).join('');
})();
