(()=>{
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
if('scrollRestoration' in history)history.scrollRestoration='manual';scrollTo(0,0);addEventListener('pageshow',()=>scrollTo(0,0));addEventListener('beforeunload',()=>scrollTo(0,0));
document.body.classList.add('locked');setTimeout(()=>document.body.classList.remove('locked'),2400);
const cv=$('.field');if(cv&&!reduce){const ctx=cv.getContext('2d');let W,H,pts=[],mx=-1e4,my=-1e4;const dpr=Math.min(devicePixelRatio,2);
const cols=['#F2A93B','#7B3F8E','#E88AA8','#9BC88B'];
function size(){W=cv.width=cv.offsetWidth*dpr;H=cv.height=cv.offsetHeight*dpr;const n=innerWidth<700?36:70;pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,z:.4+Math.random()*.9,r:(4+Math.random()*10)*dpr,a:Math.random()*6.3,c:cols[Math.random()*4|0]}))}
size();addEventListener('resize',size);
cv.parentElement.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)*dpr;my=(e.clientY-r.top)*dpr},{passive:true});
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
(function draw(){if(vis){ctx.clearRect(0,0,W,H);for(const p of pts){p.a+=.01*p.z;p.y-=.25*p.z*dpr;if(p.y<-20)p.y=H+20;const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy)||1;if(d<220*dpr){p.x+=dx/d*2.5*p.z;p.y+=dy/d*2.5*p.z}
ctx.globalAlpha=.25+p.z*.4;ctx.fillStyle=p.c;ctx.beginPath();ctx.ellipse(p.x+Math.sin(p.a)*8,p.y,p.r,p.r*.72,p.a,0,6.3);ctx.fill()}}requestAnimationFrame(draw)})();}
if(fine&&!reduce){
  const cur=$('.cursor'),dot=$('.cursor-dot');let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
  (function loop(){cx+=(mx-cx)*.16;cy+=(my-cy)*.16;cur.style.transform=`translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;requestAnimationFrame(loop)})();
  $$('a,button,.gcard,.row').forEach(el=>{el.addEventListener('mouseenter',()=>cur.classList.add('hover'));el.addEventListener('mouseleave',()=>cur.classList.remove('hover'))});
  $$('[data-mag]').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});el.addEventListener('mouseleave',()=>{el.style.transition='transform .5s cubic-bezier(.2,.8,.2,1)';el.style.transform='';setTimeout(()=>el.style.transition='',500)})});
  const px=$$('[data-px]');let pxt=false;addEventListener('mousemove',e=>{if(pxt)return;pxt=true;requestAnimationFrame(()=>{const dx=e.clientX/innerWidth-.5,dy=e.clientY/innerHeight-.5;px.forEach(el=>{const f=+el.dataset.px;el.style.transform=`rotate(${el.style.getPropertyValue('--r')}) translate(${dx*f}px,${dy*f}px)`});pxt=false})},{passive:true});
  $$('.tilt').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*9}deg) rotateY(${x*11}deg)`});el.addEventListener('mouseleave',()=>el.style.transform='')});
  const ord=$('.order');ord.addEventListener('mousemove',e=>{const r=ord.getBoundingClientRect();ord.style.setProperty('--mx',(e.clientX-r.left)/r.width*100+'%');ord.style.setProperty('--my',(e.clientY-r.top)/r.height*100+'%')},{passive:true});
  const idx=$('.index'),pv=$('.preview img'),pvw=$('.preview');let py=0,pyt=0;
  idx.addEventListener('mousemove',e=>{const r=idx.getBoundingClientRect();pyt=e.clientY-r.top-140;pvw.style.left=Math.min(e.clientX-r.left+40,r.width-240)+'px'},{passive:true});
  (function pl(){py+=(pyt-py)*.15;pvw.style.top=py+'px';requestAnimationFrame(pl)})();
  $$('.row').forEach(a=>a.addEventListener('mouseenter',()=>{pv.src=a.dataset.img;idx.classList.add('hovering')}));
  idx.addEventListener('mouseleave',()=>idx.classList.remove('hovering'));
}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.transitionDelay=e.target.dataset.d+'ms';e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
$$('.reveal').forEach((el,i)=>{el.dataset.d=(i%4)*80;io.observe(el)});
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const b=e.target,t=+b.dataset.count,s=performance.now();(function tick(n){const p=Math.min((n-s)/1400,1);b.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)})(s);co.unobserve(b)}),{threshold:.5});
$$('[data-count]').forEach(b=>co.observe(b));
$$('.gcard').forEach(g=>g.addEventListener('click',()=>open('https://www.instagram.com/kyndbites/','_blank')));
const nav=$('.nav');addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>40),{passive:true});
const burger=$('.burger'),menu=$('.menu');
function toggle(o){menu.classList.toggle('open',o);burger.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);menu.setAttribute('aria-hidden',!o);document.body.classList.toggle('locked',o)}
burger.addEventListener('click',()=>toggle(!menu.classList.contains('open')));
$$('.menu a').forEach(a=>a.addEventListener('click',()=>toggle(false)));
})();
