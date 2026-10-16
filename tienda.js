// Carrito de workbooks y pago con Mercado Pago. Los precios de acá son solo visuales:
// el servidor (api/checkout.js) vuelve a calcular el cobro con su propia tabla.
(function () {
  var PRICES = { w1: 7900, w2: 8900, w3: 9900, w4: 9900, pack: 29900 };
  var NAMES = {
    w1: 'Workbook 01 · Mi primer encuentro con la costura',
    w2: 'Workbook 02 · Conozco y uso mi máquina',
    w3: 'Workbook 03 · Medidas, moldes y corte',
    w4: 'Workbook 04 · De la idea a lo hecho a mano',
    pack: 'Pack completo · 4 workbooks'
  };
  var KEY = 'mav-carrito';

  function fmt(n) { return '$ ' + Math.round(n).toLocaleString('es-AR'); }

  function load() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter(function (id) { return PRICES[id]; }) : []; }
    catch (e) { return []; }
  }
  function save(items) { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* sin almacenamiento: el carrito vive solo en la página */ } }

  var cart = load();
  var list = document.getElementById('cart-items');
  var totalEl = document.getElementById('cart-total');
  var countEl = document.getElementById('cart-count');
  var msg = document.getElementById('cart-msg');
  var payBtn = document.getElementById('cart-pay');

  function setMsg(text, isErr) { msg.textContent = text; msg.classList.toggle('err', !!isErr); }

  function add(id) {
    if (id === 'pack') { cart = ['pack']; }
    else {
      if (cart.indexOf('pack') !== -1) cart = cart.filter(function (x) { return x !== 'pack'; });
      if (cart.indexOf(id) === -1) cart.push(id);
    }
    save(cart); render();
    setMsg(id === 'pack' ? 'Pack agregado. Reemplaza a los individuales.' : NAMES[id] + ' agregado al carrito.');
  }
  function remove(id) { cart = cart.filter(function (x) { return x !== id; }); save(cart); render(); }

  function render() {
    list.innerHTML = '';
    if (!cart.length) {
      var empty = document.createElement('li');
      empty.className = 'cart-empty';
      empty.textContent = 'Todavía no agregaste workbooks.';
      list.appendChild(empty);
    }
    var total = 0;
    cart.forEach(function (id) {
      total += PRICES[id];
      var li = document.createElement('li');
      var name = document.createElement('span'); name.textContent = NAMES[id];
      var price = document.createElement('strong'); price.textContent = fmt(PRICES[id]);
      var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'cart-remove';
      rm.textContent = 'Quitar'; rm.setAttribute('aria-label', 'Quitar ' + NAMES[id]);
      rm.addEventListener('click', function () { remove(id); });
      li.appendChild(name); li.appendChild(price); li.appendChild(rm);
      list.appendChild(li);
    });
    totalEl.textContent = fmt(total);
    countEl.textContent = cart.length ? '(' + cart.length + ')' : '';
    payBtn.disabled = !cart.length;
  }

  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () { add(btn.getAttribute('data-add')); });
  });

  payBtn.addEventListener('click', function () {
    if (!cart.length) return;
    payBtn.disabled = true;
    setMsg('Preparando tu pago en Mercado Pago…');
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) { setMsg(res.j.error || 'No se pudo iniciar el pago.', true); payBtn.disabled = false; return; }
        window.location.href = res.j.init_point;
      })
      .catch(function () { setMsg('Hubo un problema de conexión. Probá de nuevo.', true); payBtn.disabled = false; });
  });

  render();
})();
