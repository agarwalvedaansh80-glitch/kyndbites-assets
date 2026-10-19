(()=>{
/* ===== EDIT HERE: products, prices, UPI id ===== */
const PRODUCTS=[
 {id:'rose',name:'Almond Rose Brittles',price:349,unit:'200 g pouch',img:'s/21.jpg'},
 {id:'pista',name:'Pumpkin Seeds & Pistachio Brittle',price:399,unit:'200 g pouch',img:'s/18.jpg'},
 {id:'dates',name:'Dates, Nuts & Seeds Bites',price:329,unit:'200 g pouch',img:'s/22.jpg'},
 {id:'biscoff',name:'Lotus Biscoff Granola',price:449,unit:'350 g jar',img:'s/06.jpg'},
 {id:'honey',name:'Honey Roast Granola',price:399,unit:'350 g jar',img:'s/17.jpg'},
 {id:'box',name:'Festive Gift Box',price:1299,unit:'4 products, gift wrapped',img:'s/11.jpg'}
];
const WA='919833903402', UPI_ID='9833903402@upi', UPI_NAME='Kynd Bites';
const DELIVERY={mumbaiFee:49,indiaFee:99,freeAbove:999};
/* ============================================== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const base=(document.querySelector('link[rel=icon]')||{href:''}).href.replace('profile.jpg','');
const img=p=>base+p;
let cart=JSON.parse(localStorage.getItem('kb-cart')||'{}');
const save=()=>localStorage.setItem('kb-cart',JSON.stringify(cart));
const money=n=>'₹'+n.toLocaleString('en-IN');
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
const subtotal=()=>PRODUCTS.reduce((s,p)=>s+(cart[p.id]||0)*p.price,0);
const isMumbai=pin=>/^4000\d\d$|^4001\d\d$|^4006\d\d$|^4007\d\d$|^4008\d\d$|^4009\d\d$|^4010\d\d$|^4012\d\d$/.test(pin);
const fee=pin=>{const s=subtotal();if(!s)return 0;if(s>=DELIVERY.freeAbove)return 0;return isMumbai(pin||'')?DELIVERY.mumbaiFee:DELIVERY.indiaFee};

/* nav cart button */
const nav=$('.nav nav');const cb=document.createElement('a');cb.href='#';cb.className='cartbtn';cb.setAttribute('data-mag','');cb.innerHTML='<span>🛒</span><b class="cartn">0</b>';nav.insertBefore(cb,nav.querySelector('.btn'));
const fab=document.createElement('button');fab.className='cartfab';fab.innerHTML='🛒 <b class="cartn">0</b>';document.body.appendChild(fab);

/* product add controls on index rows */
$$('.row').forEach((row,i)=>{const p=PRODUCTS[i];if(!p)return;row.removeAttribute('href');row.removeAttribute('target');
  const price=document.createElement('span');price.className='rprice';price.textContent=money(p.price);
  const add=document.createElement('button');add.className='addbtn';add.type='button';add.textContent='Add +';add.setAttribute('data-mag','');
  add.addEventListener('click',e=>{e.stopPropagation();cart[p.id]=(cart[p.id]||0)+1;save();render();toast(p.name+' added');});
  row.querySelector('em').replaceWith(price);row.appendChild(add);
  row.addEventListener('click',e=>{if(e.target===add)return;cart[p.id]=(cart[p.id]||0)+1;save();render();openCart();});
});

/* drawer */
const dr=document.createElement('div');dr.className='drawer';dr.innerHTML=`<div class="drawer-bg"></div><aside class="drawer-panel"><header><h3>Your bites</h3><button class="x" aria-label="Close">×</button></header><div class="lines"></div><div class="totals"></div><button class="btn big checkout">Checkout</button><p class="tiny">Free delivery on orders above ${money(DELIVERY.freeAbove)}. Mumbai ${money(DELIVERY.mumbaiFee)}, rest of India ${money(DELIVERY.indiaFee)}.</p></aside>`;document.body.appendChild(dr);
const openCart=()=>{dr.classList.add('open');document.body.classList.add('locked')},closeCart=()=>{dr.classList.remove('open');document.body.classList.remove('locked')};
[cb,fab].forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openCart()}));
dr.querySelector('.x').addEventListener('click',closeCart);dr.querySelector('.drawer-bg').addEventListener('click',closeCart);
function render(){const n=count();$$('.cartn').forEach(b=>b.textContent=n);fab.classList.toggle('show',n>0);
  const L=dr.querySelector('.lines');L.innerHTML=n?PRODUCTS.filter(p=>cart[p.id]).map(p=>`<div class="line"><img src="${img(p.img)}" alt=""><div><b>${p.name}</b><span>${p.unit} · ${money(p.price)}</span></div><div class="qty"><button data-d="-1" data-id="${p.id}">−</button><i>${cart[p.id]}</i><button data-d="1" data-id="${p.id}">+</button></div></div>`).join(''):'<p class="empty">Your cart is empty. Add a few bites from the range.</p>';
  dr.querySelector('.totals').innerHTML=n?`<div><span>Subtotal</span><b>${money(subtotal())}</b></div><div><span>Delivery</span><b>${subtotal()>=DELIVERY.freeAbove?'Free':'calculated at checkout'}</b></div>`:'';
  dr.querySelector('.checkout').style.display=n?'':'none';
  L.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.id;cart[id]=(cart[id]||0)+ +b.dataset.d;if(cart[id]<=0)delete cart[id];save();render()}));}
render();

/* checkout modal */
const mo=document.createElement('div');mo.className='modal';mo.innerHTML=`<div class="modal-bg"></div><form class="modal-panel" novalidate>
<header><h3>Checkout</h3><button type="button" class="x" aria-label="Close">×</button></header>
<div class="steps-ind"><span class="on">1 Details</span><span>2 Payment</span><span>3 Confirm</span></div>
<div class="step s1">
 <label>Name<input name="name" required placeholder="Your name"></label>
 <label>Phone<input name="phone" required type="tel" placeholder="10-digit mobile"></label>
 <label>Address<textarea name="address" required rows="2" placeholder="Flat, building, street, area"></textarea></label>
 <div class="two"><label>City<input name="city" required placeholder="Mumbai"></label><label>Pincode<input name="pin" required inputmode="numeric" maxlength="6" placeholder="400001"></label></div>
 <label>Delivery slot<select name="slot"><option>Any time</option><option>Morning (9 to 1)</option><option>Afternoon (1 to 5)</option><option>Evening (5 to 9)</option></select></label>
 <label>Note for Nisha (optional)<input name="note" placeholder="Gift message, allergies, anything"></label>
 <div class="sum"></div>
 <button type="button" class="btn big next">Continue to payment</button>
</div>
<div class="step s2" hidden>
 <div class="pay-opts">
  <label class="pay"><input type="radio" name="pay" value="UPI" checked><div><b>Pay now with UPI</b><span>GPay, PhonePe, Paytm. Opens your UPI app with the amount filled in.</span></div></label>
  <label class="pay"><input type="radio" name="pay" value="Cash on delivery"><div><b>Cash on delivery</b><span>Pay when your bites arrive. Mumbai only.</span></div></label>
  <label class="pay"><input type="radio" name="pay" value="Pay on WhatsApp"><div><b>Pay on WhatsApp</b><span>Nisha sends you a payment link or UPI QR.</span></div></label>
 </div>
 <div class="upi-box"><p>Pay <b class="upi-amt"></b> to <code>${UPI_ID}</code> <button type="button" class="copy">copy</button></p><a class="btn upi-link" href="#">Open UPI app</a><p class="tiny">After paying, continue below. Add the UPI reference if you have it.</p><input name="ref" placeholder="UPI reference (optional)"></div>
 <button type="button" class="btn big next2">Review order</button><button type="button" class="link back">Back</button>
</div>
<div class="step s3" hidden>
 <div class="review"></div>
 <button type="button" class="btn big place">Place order on WhatsApp</button>
 <a class="link mailto" href="#">Or send by email instead</a>
 <p class="tiny">Your order opens as a ready-made WhatsApp message to Nisha. Send it and she confirms within the day.</p>
</div>
</form>`;document.body.appendChild(mo);
const F=mo.querySelector('form');const openModal=()=>{closeCart();mo.classList.add('open');document.body.classList.add('locked');go(1);updSum()},closeModal=()=>{mo.classList.remove('open');document.body.classList.remove('locked')};
dr.querySelector('.checkout').addEventListener('click',openModal);mo.querySelector('.x').addEventListener('click',closeModal);mo.querySelector('.modal-bg').addEventListener('click',closeModal);
function go(n){mo.querySelectorAll('.step').forEach((s,i)=>s.hidden=i!==n-1);mo.querySelectorAll('.steps-ind span').forEach((s,i)=>s.classList.toggle('on',i<n))}
const val=k=>F.elements[k].value.trim();
function updSum(){const f=fee(val('pin'));mo.querySelector('.sum').innerHTML=`<div><span>${count()} items</span><b>${money(subtotal())}</b></div><div><span>Delivery to ${val('pin')||'…'}</span><b>${f?money(f):'Free'}</b></div><div class="tot"><span>Total</span><b>${money(subtotal()+f)}</b></div>`}
F.elements.pin.addEventListener('input',updSum);
mo.querySelector('.next').addEventListener('click',()=>{const bad=['name','phone','address','city','pin'].filter(k=>!val(k)||(k==='phone'&&!/^\d{10}$/.test(val(k)))||(k==='pin'&&!/^\d{6}$/.test(val(k))));if(bad.length){bad.forEach(k=>F.elements[k].classList.add('bad'));toast('Please fill the highlighted fields');return}F.querySelectorAll('.bad').forEach(e=>e.classList.remove('bad'));
  const total=subtotal()+fee(val('pin'));mo.querySelector('.upi-amt').textContent=money(total);mo.querySelector('.upi-link').href=`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent('Kynd Bites order')}`;
  F.elements.pay[1].disabled=!isMumbai(val('pin'));go(2)});
mo.querySelector('.copy').addEventListener('click',()=>{navigator.clipboard&&navigator.clipboard.writeText(UPI_ID);toast('UPI id copied')});
F.elements.pay.forEach(r=>r.addEventListener('change',()=>mo.querySelector('.upi-box').style.display=F.elements.pay.value==='UPI'?'':'none'));
mo.querySelector('.back').addEventListener('click',()=>go(1));
function orderText(){const id='KB'+Date.now().toString(36).toUpperCase().slice(-6);const f=fee(val('pin'));const lines=PRODUCTS.filter(p=>cart[p.id]).map(p=>`• ${p.name} × ${cart[p.id]} = ${money(p.price*cart[p.id])}`).join('\n');
  return {id,text:`Hi Nisha, new order ${id} from kyndbites.com\n\n${lines}\n\nSubtotal: ${money(subtotal())}\nDelivery: ${f?money(f):'Free'}\nTotal: ${money(subtotal()+f)}\nPayment: ${F.elements.pay.value}${val('ref')?' (ref '+val('ref')+')':''}\n\nDeliver to:\n${val('name')}, ${val('phone')}\n${val('address')}\n${val('city')} ${val('pin')}\nSlot: ${val('slot')}${val('note')?'\nNote: '+val('note'):''}`}}
mo.querySelector('.next2').addEventListener('click',()=>{const o=orderText();mo.querySelector('.review').innerHTML='<pre>'+o.text.replace(/</g,'&lt;')+'</pre>';mo.querySelector('.place').onclick=()=>{open('https://wa.me/'+WA+'?text='+encodeURIComponent(o.text),'_blank');cart={};save();render();toast('Order sent. Nisha will confirm on WhatsApp.');setTimeout(closeModal,800)};mo.querySelector('.mailto').href='mailto:?subject='+encodeURIComponent('Kynd Bites order '+o.id)+'&body='+encodeURIComponent(o.text);go(3)});

/* enquiry form section */
const enq=document.createElement('section');enq.className='section enquiry';enq.id='enquiry';enq.innerHTML=`<div class="range-head"><div><p class="eyebrow reveal">Bulk and corporate</p><h2 class="reveal">Send an enquiry.</h2></div><p class="reveal sub">Diwali hampers, wedding favours, office gifting, café supply. Tell us what you need and we reply within a day.</p></div>
<form class="enq-form reveal" novalidate><div class="two"><label>Name<input name="name" required></label><label>Phone or email<input name="contact" required></label></div><div class="two"><label>Occasion<select name="type"><option>Corporate gifting</option><option>Wedding favours</option><option>Festive hampers</option><option>Café or retail supply</option><option>Something else</option></select></label><label>Quantity<input name="qty" placeholder="e.g. 50 boxes"></label></div><label>Tell us more<textarea name="msg" rows="3" placeholder="Budget, date, flavours, delivery city"></textarea></label><div class="cta"><button type="submit" class="btn big" data-mag>Send on WhatsApp</button><button type="button" class="btn ghost big enq-mail" data-mag>Send by email</button></div></form>`;
$('.steps').before(enq);
const enqText=f=>`Hi Nisha, enquiry from kyndbites.com\nName: ${f.name.value}\nContact: ${f.contact.value}\nType: ${f.type.value}\nQuantity: ${f.qty.value}\n${f.msg.value}`;
enq.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const f=e.target;if(!f.name.value||!f.contact.value){toast('Add your name and a way to reach you');return}open('https://wa.me/'+WA+'?text='+encodeURIComponent(enqText(f)),'_blank')});
enq.querySelector('.enq-mail').addEventListener('click',()=>{const f=enq.querySelector('form');location.href='mailto:?subject='+encodeURIComponent('Kynd Bites enquiry')+'&body='+encodeURIComponent(enqText(f))});
/* order section buttons: open cart */
$$('#order .cta a').forEach((a,i)=>{if(i===0){a.textContent='Order now';a.href='#range';a.removeAttribute('target')}});
/* toast */
const tb=document.createElement('div');tb.className='toast';document.body.appendChild(tb);let tt;function toast(m){tb.textContent=m;tb.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>tb.classList.remove('show'),2200)}
/* reveal new elements */
if(window.IntersectionObserver){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});enq.querySelectorAll('.reveal').forEach(el=>io.observe(el))}
})();
