/* Halaman kategori: kategori dipilih dari hash URL (kategori.html#engsel).
   Data dari kategori-data.js. Hash kosong atau tidak dikenal -> kategori pertama, seperti di desain. */
(function () {
  var CATS = window.PI_CATEGORIES;

  // Markup tiap baris dan chip disalin dari template desain; hanya isinya yang diganti.
  function rowHtml(row) {
    return '<div style="border-top: 1px solid color-mix(in srgb, var(--color-bg) 16%, transparent); display: flex; justify-content: space-between; gap: 20px; align-items: baseline; padding: 16px 0;">'
      + '<span style="font-family: var(--font-heading); font-weight: var(--font-heading-weight); font-size: 18px; color: var(--color-bg);">' + esc(row[0]) + '</span>'
      + '<span style="font-size: 14px; line-height: 1.5; text-align: right; color: var(--color-neutral-400);">' + esc(row[1]) + '</span>'
      + '</div>';
  }
  function chipHtml(c) {
    return '<a class="pi-chip" href="kategori.html#' + esc(c.slug) + '" style="display: inline-flex; align-items: center; padding: 12px 18px; font-size: 14px; text-decoration: none; color: var(--color-bg); border: 1px solid color-mix(in srgb, var(--color-bg) 30%, transparent);">' + esc(c.name) + '</a>';
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render() {
    var slug = (location.hash || '').replace('#', '');
    var cat = CATS.filter(function (c) { return c.slug === slug; })[0] || CATS[0];

    var photo = document.getElementById('cat-photo');
    photo.src = cat.photo;
    photo.alt = cat.alt;
    document.getElementById('cat-name').textContent = cat.name;
    document.getElementById('cat-blurb').textContent = cat.blurb;

    // Label "Item dalam kategori ini" tetap; hanya baris sesudahnya yang diganti.
    var rows = document.getElementById('cat-rows');
    while (rows.children.length > 1) rows.removeChild(rows.lastElementChild);
    rows.insertAdjacentHTML('beforeend', cat.rows.map(rowHtml).join(''));

    document.getElementById('cat-others').innerHTML = CATS
      .filter(function (c) { return c.slug !== cat.slug; })
      .map(chipHtml).join('');
  }

  render();
  window.addEventListener('hashchange', render);
})();
