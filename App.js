(() => {
const KEY = 'papaLosshaCart', FREE_AT = 35, FEE = 3, TAX = 0.08;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$' + n.toFixed(2);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/* ---------- Menu data: [name, description, price, image, sticker] ---------- */
const CATS = {
  food:{file:'un.html',label:'Food',emoji:'🍕',title:'The Hot Stuff',items:[
    ['Greek Salad','Juicy grilled chicken, fresh veggies and our special sauce.',12.99,'images (1).jfif'],
    ['Halabino Pasta','Italian pasta in tomato sauce, loaded with cheese.',15.60,'download.jfif'],
    ['Star Pizza','Mini star pizzas with mustard and grilled hotdog.',9.95,'images (2).jfif','Fan favorite'],
    ['Mexican Tacos','Grilled bread, seasoned meat, all the flavor.',14.65,'images.jfif'],
    ['Kabab Sandwich','Middle Eastern kabab grilled over the stove.',18.45,'images (4).jfif'],
    ['Lazania','Mushrooms, meat and all our favorite sauces layered up.',20.25,'images (5).jfif'],
    ['Chicken Rolls','Chicken rolls cooked hot off the stove.',13.80,'images (6).jfif'],
    ['Cheese Balls','Crispy outside, melty mozzarella inside.',10.00,'images (7).jfif'],
    ['Chicken Pastries','Flaky puff pastry hand pies with creamy chicken.',10.00,'images (8).jfif'],
    ['Romanian Steak','Garlicky flank steak seared in the pan, with sweet potato.',24.60,'images (9).jfif','Chef pick'],
    ['Baked Potato','A whole potato baked in dry heat, piled with cheese.',23.90,'images (10).jfif']]},
  drinks:{file:'ug.html',label:'Drinks',emoji:'🥤',title:'Cold & Fresh',items:[
    ['Iced Watermelon Juice','100% fresh watermelon juice over ice.',4.50,'images (11).jfif','Fan favorite'],
    ['Orange Fresh','Squeezed natural orange juice.',2.50,'images (12).jfif'],
    ['Cherry Blossom','Iced, fresh, original cherry juice.',5.90,'images (13).jfif'],
    ['Strawberry Juice','100% fresh strawberry juice.',3.50,'images (14).jfif'],
    ['Somali Cocktail','Blueberries, sparkling water and a squeeze of lemon.',4.50,'images (15).jfif'],
    ['Mango Outa','Fresh mango and carrot with a splash of soda.',6.32,'images (16).jfif'],
    ['Samoali','Mixed berries, honey, cherry and sparkling water.',4.50,'download (2).jfif'],
    ['Dr Pepper','Ice-cold Dr Pepper.',2.00,'download (3).jfif'],
    ['7UP','Crisp, refreshing 7UP.',4.50,'images (17).jfif']]},
  snacks:{file:'ul.html',label:'Snacks',emoji:'🍟',title:'Snack Attack',items:[
    ['Crispy Fries','Simple, crispy fries with ketchup.',5.99,'download(4).jfif','Popular'],
    ['Pickles','Organic pickles seasoned with garlic and spices.',4.30,'images (19).jfif'],
    ['Italian Fries','Fries topped with chicken and mixed sauces.',11.90,'images (20).jfif'],
    ['Mozzarella Fries','Crispy fries under a blanket of melted cheeses.',12.50,'images (21).jfif'],
    ['Tomato Soup','Rich tomato soup blended with our special sauce.',10.00,'images (22).jfif'],
    ['Rice Soup','Warm rice and vegetable soup, cozy in a bowl.',8.32,'images (23).jfif'],
    ['Green Soup','Fresh spinach soup, light and healthy.',12.98,'images (24).jfif']]},
  desserts:{file:'de.html',label:'Desserts',emoji:'🍰',title:'Sweet Endings',items:[
    ['Tiramisu','Creamy tiramisu topped with lotus butter.',7.50,'download (6).jfif'],
    ['Chocolate Cake','Warm chocolate cake with a molten fudge center.',8.25,'images (25).jfif','Fan favorite'],
    ['Belgian Waffle','Strawberry sauce, cream and a crisp golden waffle.',9.00,'download (5).jfif'],
    ['Honey Cake','Fluffy vanilla cake with maple syrup and fresh berries.',6.99,'images (26).jfif'],
    ['Pistachio Cheesecake','Creamy cheesecake with real pistachio flavor.',7.99,'images (27).jfif']]}
};
const DEALS = [
  ['Family Pizza Feast','1 large Star Pizza, 2 Iced Watermelon Juices and garlic bread.',18.99,25.50,'Save 25%','🍕','https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop'],
  ['Steak & Chill Deal','Romanian Steak with sweet potato and a Somali Cocktail.',26.50,32.00,'Hot deal','🥩','https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500&auto=format&fit=crop'],
  ['Taco & Soda Bundle','3 Mexican Tacos, Cheese Balls and a cold Dr Pepper.',17.50,22.00,'Bestseller','🌮','https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=500&auto=format&fit=crop']
];

/* ---------- Cart state ---------- */
let cart = [];
try {
  const raw = JSON.parse(localStorage.getItem(KEY));
  if (Array.isArray(raw)) cart = raw.filter(i => i && i.title && +i.price >= 0 && +i.qty > 0)
    .map(i => ({id: slug(i.title), title: String(i.title), price: +i.price, qty: Math.floor(+i.qty)}));
} catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} renderCart(); document.dispatchEvent(new Event('cart:change')); };
const count = () => cart.reduce((s, i) => s + i.qty, 0);
const subtotal = () => cart.reduce((s, i) => s + i.qty * i.price, 0);
function add(title, price) {
  const id = slug(title), it = cart.find(i => i.id === id);
  it ? it.qty++ : cart.push({id, title, price, qty: 1});
  save(); toast(`${title} added`);
  const b = $('.cart-btn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}
function change(id, d) {
  const it = cart.find(i => i.id === id); if (!it) return;
  it.qty += d; if (it.qty <= 0) cart = cart.filter(i => i.id !== id); save();
}
const remove = id => { cart = cart.filter(i => i.id !== id); save(); };

/* ---------- Shared chrome ---------- */
const page = document.body.dataset.page;
const nav = `<header class="nav"><div class="wrap"><a class="logo" href="home.html">Papa Lossha</a>
<nav class="links" aria-label="Main">
<a href="home.html" class="${page==='home'?'on':''}">Home</a>
<a href="un.html" class="${CATS[page]?'on':''}">Menu</a>
<a href="home.html#deals">Deals</a><a href="#footer">Contact</a>
<button class="cart-btn" id="openCart" aria-label="Open cart">🛒 Cart <b id="count">0</b></button></nav></div></header>`;
const drawer = `<div class="ov" id="ov"></div>
<aside class="drawer" id="drawer" aria-label="Your order" aria-hidden="true">
<div class="dh"><h2>Your Order</h2><button class="x" id="closeCart" aria-label="Close cart">&times;</button></div>
<div class="ship" id="ship"></div><div class="items" id="items"></div>
<div class="df"><div class="tot"><span>Subtotal</span><span id="total">$0.00</span></div>
<a class="btn" id="goCheckout" href="ch.html">Checkout</a></div></aside><div class="toast" id="toast" role="status"></div>`;
const footer = `<footer id="footer"><div class="wrap"><div class="g">
<div><h4>Papa Lossha</h4><p>Fast food made fresh, with real ingredients and a lot of heart.</p></div>
<div><h4>Menu</h4>${Object.values(CATS).map(c=>`<a href="${c.file}">${c.label}</a>`).join('')}</div>
<div><h4>Open hours</h4><p>Mon to Fri: 10 AM to 11 PM</p><p>Sat and Sun: 11 AM to 12 AM</p><p><a href="tel:+15550192834">+1 (555) 019-2834</a></p></div>
</div><small>&copy; 2026 Papa Lossha. All rights reserved.</small></div></footer>`;
document.body.insertAdjacentHTML('afterbegin', nav);
document.body.insertAdjacentHTML('beforeend', drawer + footer);

let tt; function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1600); }
function openCart(o) { $('#drawer').classList.toggle('open', o); $('#ov').classList.toggle('open', o); $('#drawer').setAttribute('aria-hidden', !o); if (o) $('#closeCart').focus(); }
$('#openCart').onclick = () => openCart(true);
$('#closeCart').onclick = $('#ov').onclick = () => openCart(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });
$('#goCheckout').addEventListener('click', e => { if (!cart.length) { e.preventDefault(); toast('Add something tasty first'); } });
$('#items').addEventListener('click', e => {
  const b = e.target.closest('button[data-a]'); if (!b) return;
  const {a, id} = b.dataset; a === 'rm' ? remove(id) : change(id, a === '+' ? 1 : -1);
});
function renderCart() {
  const s = subtotal(), left = FREE_AT - s;
  $('#count').textContent = count(); $('#total').textContent = money(s);
  $('#ship').innerHTML = cart.length ? (left > 0 ? `Add ${money(left)} more for free delivery` : 'You unlocked free delivery 🎉') + `<div class="bar"><i style="width:${Math.min(100, s / FREE_AT * 100)}%"></i></div>` : 'Free delivery on orders over ' + money(FREE_AT);
  $('#items').innerHTML = cart.length ? cart.map(i => `<div class="li"><b>${esc(i.title)}</b><span class="p">${money(i.qty * i.price)}</span>
<div class="qty"><button data-a="-" data-id="${i.id}" aria-label="Less ${esc(i.title)}">&minus;</button><span>${i.qty}</span><button data-a="+" data-id="${i.id}" aria-label="More ${esc(i.title)}">+</button></div>
<button class="rm" data-a="rm" data-id="${i.id}">Remove</button></div>`).join('')
    : '<p class="empty" style="margin-top:20px">Your cart is empty. Pick something hot from the menu.</p>';
}
renderCart();
window.addEventListener('storage', e => { if (e.key === KEY) { try { cart = JSON.parse(e.newValue) || []; } catch (x) { cart = []; } cart = cart.map(i => ({...i, id: slug(i.title)})); renderCart(); } });

/* ---------- Card rendering ---------- */
const pic = (img, emoji, alt) => `<div class="pic">${img ? `<img src="${encodeURI(img)}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">` : ''}<span>${emoji}</span></div>`;
// emoji sits behind the image, so it shows when an image is missing
const card = (n, d, p, img, st, emoji, old) => `<article class="card">${st ? `<span class="sticker">${esc(st)}</span>` : ''}
<div class="pic" style="position:relative"><span style="position:absolute">${emoji}</span>${img ? `<img style="position:relative" src="${encodeURI(img)}" alt="${esc(n)}" loading="lazy" onerror="this.remove()">` : ''}</div>
<div class="body"><h3>${esc(n)}</h3><p>${esc(d)}</p><div class="row"><span class="price">${money(p)}${old ? `<s>${money(old)}</s>` : ''}</span>
<button class="add" data-name="${esc(n)}" data-price="${p}">Add</button></div></div></article>`;
function bindAdd(root) {
  root.addEventListener('click', e => {
    const b = e.target.closest('.add'); if (!b) return;
    add(b.dataset.name, +b.dataset.price);
    b.textContent = 'Added ✓'; b.classList.add('done');
    setTimeout(() => { b.textContent = 'Add'; b.classList.remove('done'); }, 1100);
  });
}
const main = $('#main');

if (page === 'home') {
  main.innerHTML = `<section class="hero"><div class="wrap"><div><h1>Big flavor. Fast.</h1>
<p>Hand-crafted meals, fresh juices, hot snacks and desserts you will want to order twice. Ready in minutes.</p>
<a class="btn" href="un.html">Order now</a> <a class="btn alt" href="#deals">See deals</a></div>
<div class="stack" aria-hidden="true"><div class="a">🍕</div><div class="b">🍟</div></div></div></section>
<div class="ticker" aria-hidden="true"><span>🍕 Fresh daily &nbsp;&nbsp; 🥤 Free delivery over $${FREE_AT} &nbsp;&nbsp; 🌮 Ready in 30 to 45 minutes &nbsp;&nbsp; 🍰 Desserts made to order &nbsp;&nbsp; 🍟 Extra crispy &nbsp;&nbsp;</span></div>
<section class="sec" id="deals"><div class="wrap"><h2>Combo deals</h2><div class="grid">${DEALS.map(d => card(d[0], d[1], d[2], d[6], d[4], d[5], d[3])).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>Hungry for something else?</h2><div class="cats">${Object.values(CATS).map(c => `<a class="cat" href="${c.file}"><i>${c.emoji}</i>${c.label}</a>`).join('')}</div></div></section>`;
  bindAdd(main);
} else if (CATS[page]) {
  const keys = Object.keys(CATS), idx = keys.indexOf(page), c = CATS[page];
  const prev = CATS[keys[idx - 1]] || {file: 'home.html', label: 'Home'}, next = CATS[keys[idx + 1]];
  main.innerHTML = `<div class="wrap" style="padding-top:34px"><h1 class="page-h">${c.title}</h1>
<nav class="tabs" aria-label="Menu categories">${keys.map(k => `<a href="${CATS[k].file}" class="${k === page ? 'on' : ''}">${CATS[k].emoji} ${CATS[k].label}</a>`).join('')}</nav>
<div class="tools"><input class="search" id="q" type="search" placeholder="Search ${c.label.toLowerCase()}..." aria-label="Search this menu"></div>
<div class="grid" id="grid"></div>
<div class="pager"><a class="btn alt" href="${prev.file}">&larr; ${prev.label}</a>${next ? `<a class="btn" href="${next.file}">${next.label} &rarr;</a>` : `<button class="btn" onclick="document.getElementById('openCart').click()">Review order</button>`}</div></div>`;
  const grid = $('#grid');
  const draw = q => {
    const list = c.items.filter(i => (i[0] + ' ' + i[1]).toLowerCase().includes(q.toLowerCase()));
    grid.innerHTML = list.length ? list.map(i => card(i[0], i[1], i[2], i[3], i[4], c.emoji)).join('') : `<p class="empty">Nothing matches "${esc(q)}". Try a different word.</p>`;
  };
  draw(''); $('#q').addEventListener('input', e => draw(e.target.value.trim())); bindAdd(grid);
} else if (page === 'checkout') {
  main.innerHTML = `<div class="wrap" style="padding-top:34px"><h1 class="page-h">Checkout</h1><div class="co">
<form class="panel" id="form" novalidate><h2>Where should we send it?</h2>
<div class="f"><label>How do you want it?</label><div class="opts">
<label class="opt"><input type="radio" name="mode" value="Delivery" checked><i>🛵</i>Delivery</label>
<label class="opt"><input type="radio" name="mode" value="Pickup"><i>🛍️</i>Pickup</label></div></div>
<div class="f"><label for="name">Full name</label><input id="name" autocomplete="name" placeholder="e.g. John Doe"><div class="err"></div></div>
<div class="f"><label for="phone">Phone number</label><input id="phone" type="tel" autocomplete="tel" placeholder="e.g. +1 555 123 4567"><div class="err"></div></div>
<div class="f" id="addrBox"><label for="addr">Delivery address</label><input id="addr" autocomplete="street-address" placeholder="Street, building, apartment"><div class="err"></div></div>
<div class="f"><label for="notes">Notes for the kitchen or driver (optional)</label><textarea id="notes" rows="2" placeholder="Ring the bell, no onions..."></textarea></div>
<div class="f"><label>Payment</label><div class="opts">
<label class="opt"><input type="radio" name="pay" value="Cash" checked><i>💵</i>Cash</label>
<label class="opt"><input type="radio" name="pay" value="Credit Card"><i>💳</i>Card</label>
<label class="opt"><input type="radio" name="pay" value="Apple Pay / Mobile"><i>📱</i>Mobile pay</label></div></div>
<button class="btn" id="place" style="width:100%;justify-content:center">Place order</button></form>
<aside class="panel sum"><h2>Your order</h2><div id="lines"></div><div id="calcs"></div></aside></div></div>
<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="mc"><div style="font-size:54px">🎉</div><h2 id="mt">Order placed!</h2><p id="oid" style="font-weight:800"></p>
<div class="steps" id="steps"><div class="on"><i>📝</i>Received</div><div><i>🔥</i>Cooking</div><div><i>🛵</i>On the way</div></div>
<div class="rc" id="rc"></div><p style="margin-bottom:18px">Estimated time: <b id="eta">30 to 45 minutes</b></p><a class="btn" href="home.html">Back to the menu</a></div></div>`;
  const form = $('#form'), mode = () => form.mode.value;
  const totals = () => { const s = subtotal(), fee = mode() === 'Pickup' || s >= FREE_AT || !s ? 0 : FEE, tax = s * TAX; return {s, fee, tax, g: s + fee + tax}; };
  function renderSum() {
    $('#lines').innerHTML = cart.length ? cart.map(i => `<div class="li"><div><b>${esc(i.title)}</b><br><span class="qty">${i.qty} &times; ${money(i.price)}</span></div><span class="p">${money(i.qty * i.price)}</span></div>`).join('') : '<p class="empty">Your cart is empty. <a href="un.html">Browse the menu</a></p>';
    const t = totals();
    $('#calcs').innerHTML = `<div class="calc"><span>Subtotal</span><span>${money(t.s)}</span></div><div class="calc"><span>${mode()} fee</span><span>${t.fee ? money(t.fee) : 'Free'}</span></div><div class="calc"><span>Tax (8%)</span><span>${money(t.tax)}</span></div><div class="calc t"><span>Total</span><span>${money(t.g)}</span></div>`;
    $('#place').disabled = !cart.length;
    $('#addrBox').style.display = mode() === 'Pickup' ? 'none' : '';
  }
  renderSum(); document.addEventListener('cart:change', renderSum); form.addEventListener('change', renderSum);
  const rules = {name: v => v.trim().length >= 2 || 'Please enter your name.', phone: v => /^[+\d][\d\s()\-]{6,}$/.test(v.trim()) || 'Enter a valid phone number.', addr: v => mode() === 'Pickup' || v.trim().length >= 5 || 'Enter your delivery address.'};
  const check = k => { const el = $('#' + k), r = rules[k](el.value), bad = r !== true; el.classList.toggle('bad', bad); el.parentNode.querySelector('.err').textContent = bad ? r : ''; return !bad; };
  Object.keys(rules).forEach(k => $('#' + k).addEventListener('blur', () => check(k)));
  form.addEventListener('submit', e => {
    e.preventDefault(); if (!cart.length) return;
    const ok = Object.keys(rules).map(check); if (ok.includes(false)) { form.querySelector('.bad').focus(); return; }
    const t = totals(), id = 'PL-' + Math.floor(10000 + Math.random() * 90000);
    $('#oid').textContent = 'Order #' + id;
    $('#eta').textContent = mode() === 'Pickup' ? '15 to 20 minutes' : '30 to 45 minutes';
    $('#rc').innerHTML = `<p><b>${esc($('#name').value)}</b> &middot; ${esc($('#phone').value)}</p>${mode() === 'Delivery' ? `<p>${esc($('#addr').value)}</p>` : '<p>Pickup at the restaurant</p>'}<p>Pay by ${esc(form.pay.value)}</p><hr style="margin:8px 0">${cart.map(i => `<p>${i.qty} &times; ${esc(i.title)}</p>`).join('')}<p style="margin-top:6px"><b>Total: ${money(t.g)}</b></p>`;
    cart = []; save(); $('#modal').classList.add('open');
    const st = [...document.querySelectorAll('#steps div')]; st.forEach((s, i) => setTimeout(() => s.classList.add('on'), i * 1800));
  });
}
})();