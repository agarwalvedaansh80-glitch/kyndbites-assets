(()=>{
const cv=document.getElementById('c3d');if(!cv)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let started=false;
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting&&!started){started=true;o.disconnect();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=init;document.head.appendChild(s)}},{rootMargin:'400px'}).observe(cv);
function init(){
  const T=THREE,stage=cv.parentElement;
  const R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.outputEncoding=T.sRGBEncoding;
  const scene=new T.Scene();const cam=new T.PerspectiveCamera(30,1,.1,50);cam.position.set(0,.4,8.6);cam.lookAt(0,0,0);
  scene.add(new T.AmbientLight(0xfff1dd,1.1));const key=new T.DirectionalLight(0xffe2b0,.9);key.position.set(3,6,4);scene.add(key);
  const group=new T.Group();scene.add(group);
  const L=new T.TextureLoader();const tex=L.load('brittle-top.png');tex.encoding=T.sRGBEncoding;
  const N=6,LAYERS=7,TH=.05,parts=[];
  for(let i=0;i<N;i++){
    const g=new T.Group();g.userData.home=new T.Vector3();g.userData.rot=new T.Euler();
    for(let l=0;l<LAYERS;l++){
      const geo=new T.CircleGeometry(2,24,i*6.283/N,6.283/N);
      const top=l===LAYERS-1;
      const m=new T.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.5,color:top?0xffffff:new T.Color().setHSL(.09,.7,.42+l*.05)});
      const mesh=new T.Mesh(geo,m);mesh.rotation.x=-Math.PI/2;mesh.position.y=l*TH;if(!top){mesh.scale.setScalar(.985+l*.002)}
      g.add(mesh);
    }
    group.add(g);parts.push(g);
  }
  // crumbs: small photo chips
  const chipGeo=new T.CircleGeometry(.11,10);
  for(let i=0;i<36;i++){const a=Math.random()*6.283,r=.4+Math.random()*1.5;const c=new T.Mesh(chipGeo,new T.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.3,side:T.DoubleSide}));c.rotation.x=-Math.PI/2+(Math.random()-.5)*.6;c.position.set(Math.cos(a)*r,LAYERS*TH+.01,Math.sin(a)*r);c.scale.setScalar(.6+Math.random());c.userData.home=c.position.clone();c.userData.rot=c.rotation.clone();c.userData.light=true;c.visible=false;group.add(c);parts.push(c)}
  group.rotation.x=1.25;
  let tx=0,ty=0,drag=false,lx=0,ly=0,vx=0,vy=0;
  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;if(drag){vy=(e.clientX-lx)*.01;vx=(e.clientY-ly)*.01;lx=e.clientX;ly=e.clientY}else{tx=y*.5;ty=x*.9}},{passive:true});
  stage.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;stage.style.cursor='grabbing'});
  addEventListener('pointerup',()=>{drag=false;stage.style.cursor='grab'});
  let crackT=-1;const vel=new Map();
  function crack(){if(crackT>=0&&crackT<1.6)return;crackT=0;parts.forEach(o=>{let d;if(o.userData.light){o.visible=true;d=new T.Vector3(o.userData.home.x,0,o.userData.home.z).normalize()}else{const a=(parts.indexOf(o)+.5)*6.283/N;d=new T.Vector3(Math.cos(a),0,Math.sin(a))}const k=o.userData.light?2.5+Math.random()*2.5:1.4+Math.random()*.8;vel.set(o,{v:d.multiplyScalar(k).add(new T.Vector3(0,(o.userData.light?3:1.4)+Math.random()*1.5,0)),r:new T.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).multiplyScalar(o.userData.light?9:2.5)})});stage.classList.add('cracked');setTimeout(()=>stage.classList.remove('cracked'),1800)}
  stage.addEventListener('click',crack);
  new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){o.disconnect();setTimeout(crack,1200)}},{threshold:.6}).observe(cv);
  function stepCrack(dt){if(crackT<0)return;crackT+=dt;
    if(crackT<.75){parts.forEach(o=>{const u=vel.get(o);u.v.y-=9*dt;o.position.addScaledVector(u.v,dt);o.rotation.x+=u.r.x*dt;o.rotation.y+=u.r.y*dt;o.rotation.z+=u.r.z*dt})}
    else{const k=Math.min((crackT-.75)/.9,1),e=1-Math.pow(1-k,3);parts.forEach(o=>{const s=e*.25+.05;o.position.lerp(o.userData.home,s);const r=o.userData.rot;o.rotation.x+=(r.x-o.rotation.x)*s;o.rotation.y+=(r.y-o.rotation.y)*s;o.rotation.z+=(r.z-o.rotation.z)*s});if(k>=1){parts.forEach(o=>{o.position.copy(o.userData.home);o.rotation.copy(o.userData.rot);if(o.userData.light)o.visible=false});crackT=-1}}}
  function size(){const w=stage.clientWidth,h=stage.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}size();addEventListener('resize',size);
  let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
  let t=0,last=performance.now();(function loop(now){requestAnimationFrame(loop);const dt=Math.min((now-last)/1000,.05);last=now;if(!vis)return;t+=.01;stepCrack(dt);
    if(drag){group.rotation.y+=vy;group.rotation.x+=vx;vy*=.9;vx*=.9}else{group.rotation.y+=vy+(reduce?0:.012);group.rotation.x+=(1.25+tx*.6-group.rotation.x)*.05;vy*=.95;group.rotation.z+=(ty*.25-group.rotation.z)*.05}
    group.position.y=Math.sin(t*1.3)*.15;R.render(scene,cam)})(performance.now());
}
})();
