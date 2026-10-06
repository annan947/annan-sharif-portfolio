import * as THREE from './vendor/three.module.js';
import { projects } from './projects.js?v=20261006-clear-sky';
import { experiences } from './experience.js?v=20261006-clear-sky';
const stations = [...projects, ...experiences];
import { move, nearestProject, onTerrain } from './movement.js?v=20261006-continuous-city';

const host = document.querySelector('#world'), dialog = document.querySelector('#details');
const keys = new Set(), visited = new Set(); let activeProject = null, mode = 'walk', destination = null, speed = 0, phase = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
function clearInput() { keys.clear(); speed = 0; destination = null; resetJoystick() }
function openDialog(html) { clearInput(); document.querySelector('#dialog-content').innerHTML = html; if (!dialog.open) dialog.showModal() }
function projectDetails(p) { if (p.role) return experienceDetails(p); visited.add(p.id); document.querySelector('#visited').textContent = `${visited.size} / ${stations.length} EXPLORED`; openDialog(`<p class="eyebrow">${p.number} / ${p.category}</p><h2>${p.fullTitle}</h2><p>${p.description}</p><div class="chips">${p.stack.map(s => `<span>${s}</span>`).join('')}</div><ul>${p.points.map(s => `<li>${s}</li>`).join('')}</ul><a class="repo-link" href="${p.repo}" target="_blank" rel="noopener noreferrer">View project on GitHub <span>↗</span></a><p class="note">${p.note}</p>`) }
function experienceDetails(p) {
    visited.add(p.id);
    document.querySelector('#visited').textContent = `${visited.size} / ${stations.length} EXPLORED`;
    openDialog(`<p class="eyebrow">${p.number} / WORK EXPERIENCE</p><h2>${p.fullTitle}</h2><h3>${p.role}</h3><p class="eyebrow">${p.dates}</p><p>${p.description}</p><div class="chips">${p.stack.map(s => `<span>${s}</span>`).join('')}</div><ul>${p.points.map(s => `<li>${s}</li>`).join('')}</ul><a class="repo-link" href="classic.html#experience">Experience overview <span>↗</span></a>`);
}
function experienceMenu() {
    openDialog('<p class="eyebrow">LEARNING THROUGH EXPERIENCE</p><h2>Three roles. Real work.</h2><p>Visit the experience stations at the back of the island, or choose a role below.</p><div class="project-menu">' + experiences.map(p => `<button class="project-row" data-experience="${p.id}"><span style="background:${p.css}">${p.number}</span><div><strong>${p.fullTitle}</strong><small>${p.role} · ${p.dates}</small></div><span>↗</span></button>`).join('') + '</div>');
    document.querySelectorAll('[data-experience]').forEach(b => b.onclick = () => experienceDetails(experiences.find(p => p.id === b.dataset.experience)));
}
document.querySelector('#experience-button').onclick = experienceMenu;
function projectMenu() { openDialog('<p class="eyebrow">EXPLORE THE WORK</p><h2>Four projects. Four stops.</h2><p>Choose a project here, or find it on the island.</p><div class="project-menu">' + projects.map(p => `<button class="project-row" data-project="${p.id}"><span style="background:${p.css}">${p.number}</span><div><strong>${p.fullTitle}</strong><small>${p.category}</small></div><span>↗</span></button>`).join('') + '</div><div class="about-links"><a href="classic.html">Experience & resume overview ↗</a></div>'); document.querySelectorAll('[data-project]').forEach(b => b.onclick = () => projectDetails(projects.find(p => p.id === b.dataset.project))) }
document.querySelector('#projects-button').onclick = projectMenu;
document.querySelector('#about-button').onclick = () => openDialog('<p class="eyebrow">THE PERSON BEHIND THE PROJECTS</p><h2>Hey, I’m Annan.</h2><p>I’m a Computer Science student at The City College of New York, expecting to graduate in May 2028. I love problem solving: breaking down a challenge, figuring out how the pieces fit, and building something that works. My projects let me explore that curiosity through algorithms, simulations, and practical software.</p><h3>Learning through experience</h3><p>At <strong>Handshake AI</strong>, I evaluated AI responses, designed test cases and edge cases, and documented problems in reasoning and factual accuracy. The work pushed me to think critically and pay attention to details.</p><p>At <strong>Sydra through CUNY Career Launch</strong>, I wrote Python scripts to monitor water levels in a hydrolysis reactor prototype and collaborated with an engineering team on testing and hardware/software integration. I enjoyed seeing code help improve a physical system.</p><p>At <strong>Tanim Consulting</strong>, I used Python and SQL to clean and validate data, automate recurring checks, and investigate data quality issues. It gave me experience making information more reliable and workflows more efficient.</p><h3>Beyond the code</h3><p>I love TV shows, video games, movies, and music. I enjoy getting caught up in a good story, exploring the worlds that games create, and finding something new to watch or listen to. Those interests feed my creativity, while problem solving keeps me curious about how things work. Whether I’m working through a coding challenge or building a project, I enjoy the process of learning, experimenting, and figuring things out.</p><div class="chips"><span>Python</span><span>C/C++</span><span>SQL</span><span>JavaScript</span><span>React</span><span>FastAPI</span></div><a class="repo-link" href="https://mail.google.com/mail/?view=cm&fs=1&to=sharifannan497%40gmail.com&su=Hello+from+your+portfolio&body=Hi+Annan%2C%0A%0AI+came+across+your+portfolio+and+wanted+to+get+in+touch.%0A%0A" target="_blank" rel="noopener noreferrer">Let’s get in touch <span>↗</span></a><div class="about-links"><a href="classic.html">Experience ↗</a></div>');
document.querySelector('.close').onclick = () => dialog.close(); dialog.addEventListener('close', () => { clearInput(); host.focus({ preventScroll: true }) }); dialog.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close() });
document.querySelector('#soundless-help').onclick = () => openDialog('<p class="eyebrow">MAKE YOURSELF AT HOME</p><h2>Your arena controls.</h2><ul><li><strong>WASD or arrow keys:</strong> move in the direction shown on your screen.</li><li><strong>Click or tap the ground:</strong> move toward that spot. Buildings block your path; steer around them.</li><li><strong>E:</strong> open a station when you are near its entrance. You can also click its floating label.</li><li><strong>V:</strong> switch between walking and driving. Hold Shift to sprint while walking.</li><li><strong>Map stations:</strong> jump straight to a project’s entrance.</li><li><strong>Touch screens:</strong> drag the joystick in any direction or tap the ground.</li><li><strong>Escape:</strong> close station details.</li></ul><p>The Projects and Experience menus work without navigating the world.</p><a class="repo-link" href="classic.html">Open the classic portfolio ↗</a>');

let renderer; try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' }) } catch (e) { document.querySelector('#loading-text').textContent = '3D is unavailable in this browser. Open the classic portfolio below.'; throw e }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setClearColor(0x09090d); host.append(renderer.domElement);
renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); document.querySelector('#loading').classList.remove('hidden'); document.querySelector('#loading-text').textContent = 'The 3D view paused. Reload this page, or use the classic portfolio.' });
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x111a2a); const camera = new THREE.OrthographicCamera(-40, 40, 28, -28, .1, 350); const offset = new THREE.Vector3(29, 36, 37).multiplyScalar(2.7); const focus = new THREE.Vector3();
scene.add(new THREE.HemisphereLight(0xffffff, 0x434359, 2.6)); const sunlight = new THREE.DirectionalLight(0xf6eaff, 3.1); sunlight.position.set(-35, 55, -40); sunlight.castShadow = true; sunlight.shadow.mapSize.set(2048, 2048); Object.assign(sunlight.shadow.camera, { left: -42, right: 42, top: 42, bottom: -42, near: 1, far: 100 }); sunlight.shadow.normalBias = .035; sunlight.shadow.bias = -.0003; scene.add(sunlight);
const cityObstacles=[]; let actorPosition=null;
const materials = new Map(); function mat(c) { if (!materials.has(c)) materials.set(c, new THREE.MeshStandardMaterial({ color: c, roughness: .84 })); return materials.get(c) }
function box(parent, w, h, d, x, y, z, c) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m }
function cylinder(parent, r1, r2, h, x, y, z, c, n = 12) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, n), mat(c)); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m }
function sphere(parent, r, x, y, z, c) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), mat(c)); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m }
function line(parent, points, color) { const g = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p))); const m = new THREE.Line(g, new THREE.LineBasicMaterial({ color })); parent.add(m); return m }
// Continuous city ground fills the former canals, with water only outside its perimeter.
box(scene,129,1.6,148,0,-1,-18,0x56606c);
box(scene,129,.35,148,0,-.05,-18,0x8995a3);
box(scene,130,.25,149,0,-1.75,-18,0x465460);
box(scene, 56, 1.6, 70, 0, -1, -9, 0x16161e);
box(scene, 55.6, .35, 69.6, 0, -.05, -9, 0x8995a3);
box(scene, 57, .25, 71, 0, -1.75, -9, 0x0e0e14);
box(scene, 53, .06, 4.2, 0, .17, 0, 0x414954);
box(scene, 4.2, .06, 67, 0, .17, -9, 0x414954);
for (const x of [-13, 13]) box(scene, 2.7, .05, 42, x, .17, 0, 0x414954);
for (const z of [-3, 17]) box(scene, 32, .05, 2.7, 0, .17, z, 0x414954);
box(scene, 43, .06, 3, 0, .17, -24, 0x414954);
for (const x of [-18,18]) box(scene, 2.7, .06, 19, x, .17, -15, 0x414954);
for (let z = -25; z < 24; z += 3) box(scene, .13, .025, 1.1, 0, .22, z, 0xff354d);
for (let x = -24; x < 25; x += 3) box(scene, 1.1, .025, .13, x, .22, 0, 0xff354d);
// Turquoise faceted water with drifting reflections, current streaks, and shoreline foam.
const waterGeometry = new THREE.PlaneGeometry(240,240,80,80).toNonIndexed();
const waterColors=[];
for(let triangle=0;triangle<waterGeometry.attributes.position.count/3;triangle++) {
    const shade=(Math.sin(triangle*127.1+311.7)*43758.5453)%1;
    const color=new THREE.Color().setHSL(.575 + Math.abs(shade)*.018,.76,.43+Math.abs(shade)*.13);
    for(let vertex=0;vertex<3;vertex++) waterColors.push(color.r,color.g,color.b);
}
waterGeometry.setAttribute('color',new THREE.Float32BufferAttribute(waterColors,3));
const waterMaterial = new THREE.ShaderMaterial({
    vertexColors:true,
    uniforms:{time:{value:0}},
    vertexShader:`uniform float time; varying vec3 facetColor; varying float wave; varying vec2 waterXY;
        void main(){vec3 p=position; facetColor=color; waterXY=vec2(p.x,-p.y-25.0);
            wave=sin((p.x-p.y*.3)*.24-time*1.15)*.17+cos(p.y*.32-time*.85)*.11+sin((p.x+p.y)*.17-time*1.3)*.07;
            p.z+=wave; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
    fragmentShader:`uniform float time; varying vec3 facetColor; varying float wave; varying vec2 waterXY;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
        void main(){vec2 q=waterXY;
            if(abs(q.x)<65.0 && q.y>-92.5 && q.y<56.5) discard;
            // Translate surface patterns steadily along the same current direction.
            vec2 flow=q-vec2(time*1.8,time*.45);
            float broad=noise(flow*.085);
            float ripple=sin(flow.y*1.7+noise(flow*.18)*5.0);
            float streak=smoothstep(.91,.995,ripple)*smoothstep(.48,.78,noise(vec2(flow.x*.3,flow.y*.65)));
            float shore=min(abs(abs(q.x)-65.0),min(abs(q.y+92.5),abs(q.y-56.5)));
            float nearLand=(abs(q.x)<66.8 && q.y>-94.3 && q.y<58.3)?1.0:0.0;
            float foam=nearLand*(1.0-smoothstep(.2,1.6,shore))*smoothstep(.38,.67,noise(flow*.8));
            vec3 turquoise=mix(facetColor,vec3(.32,.65,.95),broad*.55);
            turquoise+=vec3(.10,.16,.25)*smoothstep(.62,.9,broad)+wave*.10;
            turquoise=mix(turquoise,vec3(.77,.90,1.0),streak*.65);
            turquoise=mix(turquoise,vec3(.92,.97,1.0),foam*.85);
            gl_FragColor=vec4(turquoise,1.0);}`
});
const river=new THREE.Mesh(waterGeometry,waterMaterial);
river.rotation.x=-Math.PI/2;river.position.set(0,-2.15,-25);scene.add(river);
const shoreline=[];
for(const [w,d,x,z] of [[130,.45,0,-92.8],[130,.45,0,56.8],[.45,149,-65.3,-18],[.45,149,65.3,-18]]) {
    const foam=new THREE.Mesh(new THREE.BoxGeometry(w,.025,d),new THREE.MeshBasicMaterial({color:0xe4faff,transparent:true,opacity:.65}));
    foam.position.set(x,-2.02,z);scene.add(foam);shoreline.push(foam);
}
// Dense NYC-inspired background: mixed massing, setbacks, spires and blue glass.
const skyline=new THREE.Group();skyline.position.set(0,-.1,-66);scene.add(skyline);
box(skyline,114,.8,34,0,-.4,-6,0x677580);
let towerIndex=0;
for(let row=0;row<3;row++)for(let col=0;col<17;col++) {
    const x=-51+col*6.4+(row%2)*2, z=-row*9;
    const h= row===0 ? 3+(col*7%11) : 5+(col*11+row*5)%21;
    const w=3.5+(col%3)*.65, d=4+(row+col)%3;
    const palette=[0x899dad,0xb6c4cc,0x728a9c,0xa0b2c0,0xced3d2];
    const color=palette[(col+row)%palette.length];
    box(skyline,w,h,d,x,h/2,z,color); cityObstacles.push({x,z:z-66,w:w+.4,d:d+.4});
    box(skyline,w*.68,.7,d*.7,x,h+.35,z,0x6f8394);
    for(const dx of [-w*.27,w*.27])box(skyline,.55,h*.75,.045,x+dx,h*.48,z+d/2+.025,0x3c648c);
    if((col+row)%4===0) {
        box(skyline,w*.76,h*.2,d*.76,x,h*1.1,z,color);
        box(skyline,w*.5,h*.12,d*.5,x,h*1.26,z,0xbcc9d1);
        cylinder(skyline,.04,.1,2.4,x,h*1.32+1.2,z,0xdce4e5,6);
    } else if((col+row)%5===0) cylinder(skyline,0,w*.45,2,x,h+1,z,0xb5c5d0,4);
    towerIndex++;
}
// Recognizable landmark silhouettes, interpreted in low-poly geometry.
for(const [w,h,y] of [[5.3,18,9],[3.9,5,20.5],[2.5,3,24.5]])box(skyline,w,h,w,-12,y,-9,0xb5c2ca);
cylinder(skyline,.08,.18,4,-12,28,-9,0xe1e6e3,6);
const oneWorld=new THREE.Mesh(new THREE.CylinderGeometry(1.25,3.3,27,4),mat(0x9ab4c8));oneWorld.position.set(20,13.5,-16);oneWorld.rotation.y=Math.PI/4;skyline.add(oneWorld);
cylinder(skyline,.055,.12,4,20,29,-16,0xe0e9ed,6);
// Distinct skyline landmarks, interpreted as original low-poly silhouettes.
// Chrysler-inspired Art Deco tower with a tiered, metallic crown.
const chrysler=new THREE.Group();chrysler.position.set(-31,0,-72);scene.add(chrysler);
box(chrysler,4.5,17,4.5,0,6.7,0,0xb6c2cb);
for(const x of [-1.6,-.8,0,.8,1.6])box(chrysler,.14,15,.07,x,6.5,2.3,0x627e96);
for(let tier=0;tier<5;tier++)cylinder(chrysler,2-tier*.34,2.35-tier*.34,1.05,0,15.75+tier*.95,0,0xdce4e8,8);
cylinder(chrysler,0,.6,3,0,21.2,0,0xeaf0f1,8);
cylinder(chrysler,.035,.065,2.5,0,23.6,0,0xd9e4eb,6);
// Chase-inspired stepped glass office tower.
const chase=new THREE.Group();chase.position.set(38,0,-76);scene.add(chase);
for(let tier=0;tier<4;tier++) {
    const w=6.7-tier*1.2,y=2+tier*5.4;
    box(chase,w,6,5.5,0,y,0,0x527287);
    for(let k=0;k<5;k++)box(chase,w+.05,.075,5.55,0,y-2.2+k,0,0xb9c9d0);
    for(const x of [-w*.38,0,w*.38])box(chase,.09,6,.09,x,y,2.8,0xd2dde1);
}
// A round tower and asymmetrical setbacks break the repeating skyline rhythm.
cylinder(skyline,2.1,2.6,15,-42,7.5,-8,0x95adbd,10);
cylinder(skyline,1.6,2.1,3,-42,16.5,-8,0xcbd6dc,10);
box(skyline,5,13,6,42,6.5,-20,0xa1b2bf);
box(skyline,2.6,8,3,43,17,-20.8,0x768ea0);
// City districts wrap around a clear canal, with low foreground waterfront blocks.
const district=new THREE.Group();district.position.y=1.7;scene.add(district);
for(const x of [-52,52]) {
    box(district,25,1,111,x,-2.1,-10,0x56606c);
    box(district,7,.08,101,x- Math.sign(x)*5,-1.55,-8,0x414954);
    box(district,2,.08,101,x-Math.sign(x)*8.6,-1.51,-8,0xa0a9ad);
}
for(const [z,depth] of [[-73,38],[46,20]]) {
    box(district,129,1,depth,0,-2.1,z,0x56606c);
    box(district,99,.08,7,0,-1.55,z<0?-58:43,0x414954);
    box(district,99,.08,2,0,-1.51,z<0?-54.5:39.5,0xa0a9ad);
}
function cityBlock(x,z,height,index) {
    const color=[0xa7b4bd,0x7f929f,0xc2c8c8,0x8093a5,0x929caa][index%5];
    box(district,5.8,height,5.5,x,height/2-1.5,z,color); cityObstacles.push({x,z,w:6.2,d:6});
    box(district,6.1,.28,5.8,x,height-1.38,z,0xd8d9d2);
    box(district,2.5,.65,2,x+1,height-.96,z-.5,0x637482);
    if(height>8) {box(district,4,height*.22,3.8,x,height*1.11-1.5,z,color);}
    // Blue inset glazing and light pilasters give each tower a readable silhouette.
    for(const dx of [-1.7,0,1.7]) {
        box(district,.8,height*.7,.05,x+dx,height*.48-1.5,z+2.78,0x3e607d);
        box(district,.1,height*.72,.08,x+dx+.48,height*.48-1.5,z+2.82,0xd4dadd);
    }
}
let blockIndex=0;
for(const x of [-58,58]) for(let z=-45;z<37;z+=10) cityBlock(x,z,z< -20?7+(blockIndex%3)*2:3.2+(blockIndex%3)*.8,blockIndex++);
for(let x=-55;x<60;x+=10) {
    cityBlock(x,-80,10+(blockIndex*7%13),blockIndex++);
    cityBlock(x,51,2.5+(blockIndex%3)*.6,blockIndex++);
}
// Waterfront parks and walking paths break up the street grid.
for(const x of [-42,42]) for(const z of [-42,-18,8,29]) {
    box(district,3.8,.09,5,x,-1.46,z,0x758a65);
    cylinder(district,.1,.18,1.2,x,-.8,z,0x76604b,7);
    const canopy=sphere(district,.8,x,.3,z,0x8fa76c);canopy.scale.y=1.3;
}
// Streets and sidewalks link the portfolio plaza directly to the surrounding districts.
for(const x of [-34,34]) {
    box(scene,7,.06,104,x,.19,-9,0x414954);
    for(const dx of [-4.4,4.4])box(scene,1.7,.08,104,x+dx,.17,-9,0xb5bfc7);
    box(scene,20,.06,7,x,.19,0,0x414954);
}
for(const z of [-49,31]) {
    box(scene,99,.06,7,0,.19,z,0x414954);
    for(const dz of [-4.4,4.4])box(scene,99,.08,1.7,0,.17,z+dz,0xb5bfc7);
    box(scene,7,.06,18,0,.19,z,0x414954);
}
cityObstacles.push({x:-12,z:-75,w:6,d:6},{x:20,z:-82,w:7,d:7},{x:-31,z:-72,w:5,d:5},{x:38,z:-76,w:7,d:6},{x:-42,z:-74,w:5.5,d:5.5},{x:42,z:-86,w:6,d:7});
// Traffic loops on the city roads, separated from the playable island by water.
function loopPosition(distance,xExtent,zNorth,zSouth) {
    const width=xExtent*2,depth=zSouth-zNorth,total=2*(width+depth);
    let d=((distance%total)+total)%total;
    if(d<width)return {x:-xExtent+d,z:zNorth,angle:Math.PI/2}; d-=width;
    if(d<depth)return {x:xExtent,z:zNorth+d,angle:0};d-=depth;
    if(d<width)return {x:xExtent-d,z:zSouth,angle:-Math.PI/2};d-=width;
    return {x:-xExtent,z:zSouth-d,angle:Math.PI};
}
const traffic=[];
for(let i=0;i<16;i++) {
    const vehicle=new THREE.Group();scene.add(vehicle);
    const color=[0xe8b93f,0xe8b93f,0xd85452,0xcdd6db,0x456681,0x353c46][i%6];
    box(vehicle,1.2,.4,2.3,0,.5,0,color);
    box(vehicle,1,.48,1.1,0,.93,-.05,color);
    box(vehicle,.86,.34,.03,0,.98,.52,0x2a465e);
    box(vehicle,.86,.34,.03,0,.98,-.62,0x2a465e);
    for(const x of [-.6,.6])for(const z of [-.75,.75]) {
        const wheel=cylinder(vehicle,.25,.25,.12,x,.35,z,0x20242a,8);wheel.rotation.z=Math.PI/2;
    }
    for(const x of [-.36,.36])box(vehicle,.2,.12,.04,x,.54,1.17,0xffe6a1);
    if(i%6<2)box(vehicle,.35,.1,.3,0,1.24,0,0xffe3a0);
    traffic.push({mesh:vehicle,slot:Math.floor(i/2),lane:i%2,reverse:i%2===0});
}
// Railway joins both waterfronts and two supported station platforms.
box(scene,133,.4,3.2,0,4,34,0x697d8f);
for(const z of [33.2,34.8])box(scene,133,.09,.1,0,4.25,z,0xe3edf1);
for(let x=-65;x<67;x+=1.8)box(scene,.18,.08,2.5,x,4.22,34,0x3d4f5f);
for(let x=-63;x<66;x+=9)box(scene,.6,6.1,.6,x,1.1,34,0x677c8c);
for(const x of [-59,59]) {
    box(scene,13,.6,3.5,x,3.9,37.2,0xa9b6c1); cityObstacles.push({x,z:37.2,w:13,d:3.5},{x,z:42,w:3,d:8});
    box(scene,13,.04,.2,x,4.23,35.55,0xefc34c);
    // Stairs reach the city sidewalk behind the platform.
    for(let step=0;step<18;step++)box(scene,3,.22,.5,x,.31+step*.22,45.5-step*.45,0xc2cbd0);
    for(const dx of [-5,5])box(scene,.14,2.8,.14,x+dx,5.5,37.2,0x536778);
    box(scene,13.5,.18,3.8,x,6.9,37.2,0x54718a);
}
for(const x of [-64,64]) {
    box(scene,7,4,7,x,2.2,34,0x6b7e8e);
    box(scene,7,.5,7,x,4.7,34,0xaebdc8);
    // Dark tunnel mouth covers the entry and exit of each train car.
    box(scene,.04,1.8,2.4,x+(x<0?3.51:-3.51),4.5,34,0x182431);
    cityObstacles.push({x,z:34,w:7,d:7});
}
const trainCars=[];
for(let i=0;i<4;i++) {
    const carriage=new THREE.Group();scene.add(carriage);
    box(carriage,1.6,1.15,5.2,0,.83,0,0xc5d0d6);
    box(carriage,1.68,.25,5.3,0,1.48,0,0xe2e6e4);
    for(const x of [-.82,.82]) {
        box(carriage,.04,.18,5.1,x,.56,0,0x397fb0);
        for(const z of [-1.8,-.6,.6,1.8])box(carriage,.04,.45,.68,x,1.08,z,0x304c67);
    }
    box(carriage,1.22,.43,.04,0,1.07,2.62,0x304c67);
    for(const x of [-.5,.5])box(carriage,.17,.13,.04,x,.6,2.63,0xffe0a5);
    trainCars.push(carriage);
}
const laneProgress=[0,0]; let lastCityTime=0;
function trafficPoint(car,progress) {
    const outer=car.lane===0, extent=outer?48.5:45.5,north=outer?-59.5:-56.5,south=outer?44.5:41.5;
    const total=2*(2*extent+south-north),sign=car.reverse?-1:1;
    const point=loopPosition(car.slot*total/8+progress*sign,extent,north,south);
    return {...point,angle:point.angle+(car.reverse?Math.PI:0)};
}
function animateCity(time) {
    const dt=Math.max(0,Math.min(time-lastCityTime,.04));lastCityTime=time;
    for(let lane=0;lane<2;lane++) {
        const proposed=laneProgress[lane]+dt*6;
        // A whole lane pauses together, preserving headway when the player blocks it.
        const blocked=actorPosition && traffic.some(car=>{if(car.lane!==lane)return false;const p=trafficPoint(car,proposed);return Math.hypot(p.x-actorPosition.x,p.z-actorPosition.z)<4.8;});
        if(!blocked)laneProgress[lane]=proposed;
    }
    for(const car of traffic) {const point=trafficPoint(car,laneProgress[car.lane]);car.mesh.position.set(point.x,.22,point.z);car.mesh.rotation.y=point.angle;}
    // The entire train exits the viewport before wrapping, so cars stay connected.
    const limit=80;
    const trainX=((time*12+limit)%(2*limit))-limit;
    trainCars.forEach((car,i)=>{car.position.set(trainX+(i-1.5)*6.4,4.3,34);car.rotation.y=Math.PI/2;// Hide each whole carriage before its nose touches either solid station entrance.
        const tunnelInnerEdge=60.49, carriageHalfLength=2.65;
        car.visible=Math.abs(car.position.x)+carriageHalfLength<tunnelInnerEdge;});
}
animateCity(0);
// Faceted golden sun and a sparse spread of blue-white low-poly clouds.
const sun=new THREE.Mesh(new THREE.IcosahedronGeometry(2.6,1),new THREE.MeshStandardMaterial({color:0xffee19,emissive:0xffbd00,emissiveIntensity:.65,roughness:1,flatShading:true}));
sun.position.set(-18,13,-56);scene.add(sun);
// A fixed sky camera keeps sky animation independent of player/city camera motion.
const skyScene=new THREE.Scene(), skyCamera=camera.clone();
skyCamera.position.copy(offset);skyCamera.lookAt(0,0,0);skyCamera.updateMatrixWorld();
skyScene.add(new THREE.HemisphereLight(0xffffff,0x434359,2.6));
const skyLight=new THREE.DirectionalLight(0xf6eaff,3.1);skyLight.position.set(-35,55,-40);skyScene.add(skyLight);
skyScene.add(sun);
const skyClouds=[];
const cloudMaterial=new THREE.MeshStandardMaterial({color:0xe1e8f5,roughness:1,flatShading:true});
for(const [x,y,z,scale] of [[-25,11,-55,.9],[-11,11,-57,.8],[26,12,-60,.8],[-48,8,-20,.65],[42,9,2,.6],[-36,10,-38,.6],[15,16,-72,.65],[48,13,-35,.65],[-5,10,37,.55]]) {
    const cloud=new THREE.Group();cloud.position.set(x,y,z);cloud.scale.set(scale*1.2,scale*.7,scale*.85);
    for(const [dx,dy,dz,r] of [[-2.7,0,0,1.6],[-.9,.5,0,2.4],[1.5,.2,0,2.1],[3.2,-.3,.2,1.4],[.2,-.5,1,1.7]]) {
        const puff=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),cloudMaterial);puff.position.set(dx,dy,dz);cloud.add(puff);
    }
    skyScene.add(cloud);skyClouds.push({mesh:cloud,x,z,flightReady:false});
}
// Camera-aligned sky lanes stay above the tallest skyline geometry.
const cloudDirection=new THREE.Vector3(offset.z,0,-offset.x).normalize();
const screenUp=new THREE.Vector3(0,1,0).projectOnPlane(offset).normalize();
const skyDepth=offset.clone().normalize();
skyClouds.forEach((cloud,index)=>{cloud.progress=index/skyClouds.length;cloud.lane=[.34,.47,.60][index%3];});
function animateClouds(dt) {
    const span=camera.right-camera.left;
    const height=camera.top-camera.bottom;
    const centerX=(camera.right+camera.left)/2;
    const centerY=(camera.top+camera.bottom)/2;
    // Higher, smaller sun; its own depth plane cannot intersect the clouds.
    sun.position.set(0,0,0).addScaledVector(skyDepth,105)
        .addScaledVector(cloudDirection,centerX+span*.025)
        .addScaledVector(screenUp,centerY+height*.41);
    for(const cloud of skyClouds) {
        if(!reduced)cloud.progress=(cloud.progress+dt*4.5/(span+24))%1;
        const x=cloud.progress*(span+24)-span/2-12;
        cloud.mesh.position.set(0,0,0).addScaledVector(skyDepth,85)
            .addScaledVector(cloudDirection,centerX+x)
            .addScaledVector(screenUp,centerY+cloud.lane*height/2);
    }
}
// Tiny Liberty Island in the side canal, separate from the playable stations.
const libertyIsland=new THREE.Group();libertyIsland.position.set(-82,-1.7,35);libertyIsland.scale.setScalar(2.2);scene.add(libertyIsland);
cylinder(libertyIsland,3.1,3.6,.65,0,.2,0,0x778a67,12);
cylinder(libertyIsland,3.15,3.6,.2,0,-.13,0,0xabb8b0,12);
box(libertyIsland,2.4,.7,2.4,0,.85,0,0xc5bca2);
box(libertyIsland,1.5,1.3,1.5,0,1.75,0,0xb2a991);
const patina=0x77b3a1;
cylinder(libertyIsland,.48,.9,2.5,0,3.5,0,patina,7);
box(libertyIsland,.85,1.15,.55,0,4.4,0,patina);
sphere(libertyIsland,.39,0,5.15,0,patina);
// Raised torch arm and left-hand tablet.
const raisedArm=box(libertyIsland,.27,1.55,.27,.63,5.13,0,patina);raisedArm.rotation.z=-.38;
sphere(libertyIsland,.18,.9,5.83,0,patina);
cylinder(libertyIsland,.09,.13,.65,.93,6.15,0,0x8da896,7);
cylinder(libertyIsland,.24,.15,.3,.93,6.58,0,0xc9a75f,7);
const flame=sphere(libertyIsland,.24,.93,6.87,0,0xffd147);flame.scale.y=1.6;
const tablet=box(libertyIsland,.47,.75,.12,-.5,4.28,.34,0x91c1ac);tablet.rotation.z=-.18;
for(let i=0;i<7;i++) {
    const angle=-Math.PI*.85+i*Math.PI*1.7/6;
    const spike=cylinder(libertyIsland,0,.08,.44,Math.sin(angle)*.38,5.47+Math.cos(angle)*.13,0,patina,5);
    spike.rotation.z=-angle;
}
for(const x of [-1.7,1.7])box(libertyIsland,.8,.07,2,x,.59,0,0xb6baa8);
// Small ferries glide through the canal and leave lightly animated wakes.
const boats=[];
for(let i=0;i<3;i++) {
    const boat=new THREE.Group();scene.add(boat);
    cylinder(boat,.6,.42,2.7,0,.15,0,0xf1f2eb,4).rotation.x=Math.PI/2;
    box(boat,1.1,.28,2.4,0,.3,0,0xe1e7e8);
    box(boat,.85,.55,1.15,0,.66,-.2,0xf1eee2);
    box(boat,.74,.27,.05,0,.76,.4,0x49758b);
    box(boat,.9,.1,1.3,0,.99,-.2,0xcf514a);
    const wake=new THREE.Mesh(new THREE.PlaneGeometry(.9,2.7),new THREE.MeshBasicMaterial({color:0xe8fbff,transparent:true,opacity:.36,depthWrite:false}));
    wake.rotation.x=-Math.PI/2;wake.position.set(0,-.04,-2.3);boat.add(wake);
    boats.push({mesh:boat,wake,index:i});
}
function animateBoats(time) {
    for(const b of boats) {
        const phase=time*.14+b.index*2,travel=Math.sin(phase),direction=Math.cos(phase)>0?1:-1;
        if(b.index===0)b.mesh.position.set(travel*48,-1.93,65);
        else if(b.index===1)b.mesh.position.set(-70,-1.93,-30+travel*42);
        else b.mesh.position.set(74,-1.93,-18+travel*54);
        b.mesh.rotation.y=b.index!==0?(direction>0?0:Math.PI):(direction>0?Math.PI/2:-Math.PI/2);
        b.mesh.position.y+=Math.sin(time*1.3+b.index)*.08;
        b.mesh.rotation.z=Math.sin(time*1.1+b.index)*.025;
        b.wake.material.opacity=.28+Math.abs(Math.cos(phase))*.18;
    }
}
animateBoats(0);
// Central plaza and welcome sculpture.
cylinder(scene, 3.7, 3.7, .1, 0, .23, 0, 0x343440, 48); cylinder(scene, 1.7, 1.9, .45, 0, .5, -1.7, 0x545462, 32); const emblem = new THREE.Group(); emblem.position.set(0, 1.75, -1.7); scene.add(emblem); const torus = new THREE.Mesh(new THREE.TorusGeometry(.82, .20, 8, 32), mat(0xff354d)); emblem.add(torus); box(emblem, .3, 1.5, .3, .72, -.17, 0, 0xff354d); sphere(emblem, .2, 1.3, -.72, 0, 0xff354d);
const obstacles = [...cityObstacles, { x: 0, z: -1.7, w: 3.5, d: 3.5 }]; const animated = [];
// Signal pylons replace the landscape trees.
function tree(x, z, scale = 1) {
    const g = new THREE.Group(); g.position.set(x,.2,z); g.scale.setScalar(scale); scene.add(g);
    box(g,1.2,.3,1.2,0,.15,0,0x444450);
    box(g,.45,3.8,.45,0,2,0,0x181820);
    for (let i=0;i<3;i++) box(g,.6,.18,.6,0,2.5+i*.45,0,0xff354d);
    box(g,1,.3,1,0,4,0,0xeeeeef);
}
for (const [x, z, s] of [[-24, -40, 1.1], [-22, -37, .7], [-9, -40, 1.2], [9, -40, .8], [22, -40, 1.2], [24, -37, .8], [-24, 7, 1], [-24, 12, .8], [-23, 21, 1.1], [-19, 23, .7], [22, 20, 1.1], [24, 16, .8], [4, 23, .85], [-3, 22, 1], [24, -3, .9], [-24, -4, .8]]) tree(x, z, s);
function bench(x, z) { box(scene, 2.1, .13, .65, x, .8, z, 0x43434f); box(scene, 2.1, .65, .12, x, 1.15, z - .3, 0x43434f); for (const xx of [-.75, .75]) box(scene, .12, .6, .5, x + xx, .45, z, 0xff354d) } bench(-5, 4); bench(5, 4); bench(-5, -5); bench(5, -5);
for (const [x, z] of [[-5, -23], [4, 16], [-21, 0], [21, 0]]) { cylinder(scene, .07, .09, 3, x, 1.65, z, 0x454552, 8); sphere(scene, .25, x, 3.3, z, 0xff354d); cylinder(scene, .4, .4, .12, x, .25, z, 0x292934) }
function label(p) { const b = document.createElement('button'); b.className = 'station-label'; b.style.setProperty('--station-color', p.css); b.innerHTML = `<span class="number">${p.number}</span><span>${p.title}<small>${p.category}</small></span><span>↗</span>`; b.setAttribute('aria-label', `Explore ${p.fullTitle}`); b.onclick = () => projectDetails(p); document.querySelector('#labels').append(b); return b }
for (const x of [-24, -9, 9, 24]) tree(x, -39, .85);
const labels = [];

for (const p of stations) {
    const g = new THREE.Group(); g.position.set(p.x, .2, p.z); scene.add(g); obstacles.push({ x: p.x, z: p.z, w: 8.2, d: 6.4 }); box(g, 9, .4, 7.4, 0, .2, 0, 0xa2acb5); box(g, 8.2, .6, 6.4, 0, .7, 0, p.color); box(g, 8.1, .14, 6.3, 0, 1.07, 0, 0xc5cfd4); box(g, 2.2, .18, 1.1, 0, .1, 4, 0xff354d); const marker = cylinder(g, .8, .8, .04, 0, .03, 4.8, p.color, 32); animated.push({ kind: 'marker', mesh: marker });
    if (p.id === 'maze') { box(g, 7.3, .15, 5.5, 0, 1.22, 0, 0xded8ed); for (let r = 0; r < 5; r++)for (let c = 0; c < 7; c++) { if (r === 0 || r === 4 || c === 0 || c === 6 || ((r + c) % 3 === 0 && r !== 2)) box(g, .82, .65, .75, (c - 3) * .95, 1.6, (r - 2) * .98, 0xaaa0cc) } for (let i = 0; i < 6; i++)box(g, .38, .05, .28, -2.5 + i * .85, 1.35, 0, 0x688c68); box(g, 1, .07, .45, 2.8, 1.35, .55, 0xe1b969) }
    if (p.id === 'stock') { box(g, 6.8, 4.5, .4, 0, 3.2, -1.8, 0x344e44); box(g, 7, .2, .65, 0, 5.55, -1.8, p.color); for (let k = 0; k < 4; k++)line(g, [[-3, 1.8 + k * .8, -1.55], [3, 1.8 + k * .8, -1.55]], 0x668170); let seed = 19; for (let n = 0; n < 10; n++) { let y = 2.7; const pts = []; for (let i = 0; i < 30; i++) { seed = (seed * 16807) % 2147483647; y += (seed / 2147483647 - .44) * .28; pts.push([-3 + i * .205, Math.max(1.4, Math.min(5.2, y)), -1.53 + n * .003]) } line(g, pts, n % 3 === 0 ? 0xecd195 : 0x9cbd91) } for (let i = 0; i < 5; i++)box(g, .62, .4 + i * .34, .7, -2.2 + i * 1.1, 1.35 + i * .17, 1.6, p.color) }
    if (p.id === 'infection') { box(g, 6.4, .22, 4.4, 0, 1.25, 0, 0xd4e0c2); const dome = new THREE.Mesh(new THREE.SphereGeometry(2.35, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xe7f4e8, transparent: true, opacity: .22, roughness: .2, depthWrite: false })); dome.position.y = 1.4; g.add(dome); for (let i = 0; i < 17; i++) { const a = i * 2.4, r = .5 + (i % 4) * .42; const dot = sphere(g, .19, Math.cos(a) * r, 1.55, Math.sin(a) * r, i < 7 ? 0xdc8e7b : 0x6d9d77); animated.push({ kind: 'agent', mesh: dot, a, r }) } cylinder(g, .25, .25, 1.5, -3, 1.9, -1.5, 0xd59988); cylinder(g, .25, .25, 1, -3, 1.65, 1, 0x9aae89) }
    if (p.id === 'weather') { box(g, 4.8, 3.6, .35, 0, 3, -1.2, 0x4b7c8b); const sun = sphere(g, .7, -1.1, 3.5, -.8, 0xf4d08d); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const ray = box(g, .13, .4, .1, -1.1 + Math.sin(a) * 1, 3.5 + Math.cos(a) * 1, -.8, 0xf4d08d); ray.rotation.z = -a } const cloud = new THREE.Group(); g.add(cloud); for (const [x, y, r] of [[0, 3.4, .55], [.65, 3.6, .7], [1.25, 3.35, .5]]) sphere(cloud, r, x, y, -.3, 0xf6f7eb); animated.push({ kind: 'cloud', mesh: cloud }); for (let i = 0; i < 3; i++)box(g, .13, .45, .13, .1 + i * .55, 2.35, -.25, 0x96d7e9); box(g, 5.1, .2, .7, 0, 4.85, -1.2, p.color); for (let i = 0; i < 3; i++)cylinder(g, .38, .38, .35, -1.5 + i * 1.5, 1.35, 1.5, 0xe1eff0, 20) }
    if (p.id === 'handshake') {
        box(g, 6.4, 3.5, .4, 0, 3, -1.5, 0x344e60);
        for (const [x,y] of [[-2,2.3],[-2,3.7],[0,3],[2,2.3],[2,3.7]]) sphere(g,.3,x,y,-1.15,p.color);
        for (const y of [2.3,3.7]) { line(g,[[-2,y,-1.12],[0,3,-1.12],[2,y,-1.12]],0xdbeaf5); }
        box(g, 3.7, .2, 1.7, 0, 1.65, 1.1, 0xf5f3e5);
        for (const x of [-1.2,0,1.2]) box(g,.6,.12,.8,x,1.85,1.1,p.color);
    }
    if (p.id === 'sydra') {
        for (const x of [-1.4,1.4]) {
            cylinder(g,.85,.85,2.7,x,2.6,-.6,0xd6e9e0,20);
            cylinder(g,.9,.9,.2,x,4,-.6,0x4c8475,20);
            cylinder(g,.65,.65,.12,x,4.17,-.6,p.color,20);
        }
        box(g,2.8,.2,.2,0,3.3,-.6,0x688b7d);
        box(g,2.3,1.4,.4,0,1.95,1.7,0x34584e);
        for (let i=0;i<3;i++) box(g,.45,.5+i*.15,.05,-.65+i*.65,2,1.94,p.color);
    }
    if (p.id === 'tanim') {
        for (const x of [-2,0,2]) {
            for (let i=0;i<3;i++) cylinder(g,.75,.75,.75,x,1.7+i*.85,-.7,i%2?p.color:0xf2dfeb,20);
            cylinder(g,.75,.75,.1,x,3.9,-.7,0x8d5e7e,20);
        }
        line(g,[[-2,1.25,1.6],[0,1.25,1.6],[2,1.25,1.6]],0x8d5e7e);
        for (const x of [-2,0,2]) box(g,.55,.15,.55,x,1.3,1.6,p.color);
    }
    labels.push({ p, element: label(p), position: new THREE.Vector3(p.x, 6.5, p.z) });
    const pin = document.createElement('button'); pin.style.left = `${(p.x + 65) / 130 * 100}%`; pin.style.top = `${(p.z + 93) / 150 * 100}%`; pin.style.background = p.css; pin.textContent = p.number; pin.setAttribute('aria-label', `Visit ${p.title}`); pin.onclick = () => { clearInput(); player.position.set(p.x, .25, p.z + 5.4); host.focus({ preventScroll: true }) }; document.querySelector('#map-stations').append(pin);
}
// A low-poly explorer and compact electric buggy share the same movement controller.
// Original armored explorer and track-focused supercar, built as outlined low-poly models.
const player = new THREE.Group(); player.position.set(0, .25, 6); actorPosition=player.position; scene.add(player);
const avatar = new THREE.Group(); player.add(avatar);
const armor=0xe8edf0, darkArmor=0x253664, trim=0xf2c948, joints=0x191c25, accent=0xdb3042;
// Gundam-inspired segmented mecha: white plating, navy core, red feet, gold vents.
box(avatar,.88,.87,.52,0,1.38,0,darkArmor);
const breastplate=box(avatar,1,.34,.22,0,1.65,.31,darkArmor);breastplate.rotation.x=-.15;
for(const side of [-1,1]) {
    box(avatar,.28,.33,.13,side*.29,1.45,.35,trim);
    for(let i=0;i<3;i++)box(avatar,.27,.035,.035,side*.29,1.36+i*.10,.43,joints);
    const chestWing=box(avatar,.27,.18,.34,side*.45,1.72,.14,armor);chestWing.rotation.z=side*.22;
}
box(avatar,.28,.2,.10,0,1.61,.45,accent);
box(avatar,.52,.34,.45,0,1.09,0,armor);
box(avatar,.85,.18,.56,0,.90,0,darkArmor);
box(avatar,.29,.18,.18,0,.9,.35,trim);
for(const side of [-1,1]) {
    const skirt=box(avatar,.35,.39,.16,side*.26,.72,.32,armor);skirt.rotation.x=-.18;
    const hip=box(avatar,.20,.36,.50,side*.49,.77,0,armor);hip.rotation.z=-side*.2;
}
// Power pack and two upright thruster pods behind the shoulders.
box(avatar,.6,.7,.30,0,1.43,-.40,darkArmor);
for(const side of [-1,1]) {
    box(avatar,.19,.79,.20,side*.38,1.65,-.47,armor);
    cylinder(avatar,.12,.15,.32,side*.26,1.1,-.45,joints,8);
    const fin=box(avatar,.09,.94,.12,side*.37,2.03,-.48,armor);fin.rotation.z=side*-.12;
}
// Helmet, recessed green eyes, cheek plates, and red chin.
box(avatar,.64,.60,.58,0,2.1,0,armor);
box(avatar,.68,.15,.59,0,2.39,-.02,armor);
box(avatar,.52,.12,.05,0,2.15,.32,joints);
for(const side of [-1,1]) {
    const eye=box(avatar,.19,.055,.04,side*.15,2.15,.365,0x63ffcf);eye.rotation.z=side*.10;
    const cheek=box(avatar,.16,.28,.20,side*.28,1.98,.29,armor);cheek.rotation.z=-side*.19;
    const ear=cylinder(avatar,.13,.13,.10,side*.36,2.14,0,darkArmor,10);ear.rotation.z=Math.PI/2;
    // Long tapered V-fins, pointing out and up from the red forehead sensor.
    const fin=cylinder(avatar,.015,.07,.80,side*.31,2.58,.27,armor,4);fin.rotation.z=-side*.68;
}
box(avatar,.15,.21,.12,0,2.33,.34,accent);
box(avatar,.25,.22,.15,0,1.93,.37,accent);
box(avatar,.32,.04,.03,0,2.01,.43,joints);
const legs=[],arms=[];
for(const side of [-1,1]) {
    const leg=new THREE.Group();leg.position.set(side*.26,.78,0);avatar.add(leg);
    box(leg,.29,.70,.32,0,-.30,0,joints);
    box(leg,.35,.34,.36,0,-.13,.04,armor);
    box(leg,.37,.21,.24,0,-.37,.22,armor);
    box(leg,.30,.36,.34,0,-.56,.06,armor);
    box(leg,.12,.22,.04,0,-.57,.25,darkArmor);
    box(leg,.43,.18,.62,0,-.69,.15,accent);
    box(leg,.34,.07,.28,0,-.62,.29,armor);legs.push(leg);
    const arm=new THREE.Group();arm.position.set(side*.63,1.72,0);avatar.add(arm);
    const shoulder=box(arm,.52,.37,.59,side*.04,.02,0,armor);shoulder.rotation.z=-side*.15;
    box(arm,.35,.07,.36,side*.06,.23,0,darkArmor);
    box(arm,.22,.43,.26,0,-.31,0,joints);
    box(arm,.31,.32,.35,0,-.48,.04,armor);
    box(arm,.14,.14,.035,0,-.47,.23,accent);
    box(arm,.29,.21,.30,0,-.71,.04,joints);arms.push(arm);
}
avatar.scale.setScalar(2.3);
const car=new THREE.Group(); player.add(car); car.visible=false;
// A custom faceted shell, with narrow front and broad mid-engine rear shoulders.
function trackShell() {
    const rings=[{z:-1.65,w:.87,y:.66},{z:-1.15,w:1.02,y:.82},{z:.5,w:.96,y:.70},{z:1.65,w:.86,y:.48}];
    const points=[];
    for(const r of rings) points.push([-r.w,.32,r.z],[r.w,.32,r.z],[r.w,r.y,r.z],[-r.w,r.y,r.z]);
    const indices=[]; for(let i=0;i<rings.length-1;i++)for(let j=0;j<4;j++){const a=i*4+j,b=i*4+(j+1)%4,c=(i+1)*4+(j+1)%4,d=(i+1)*4+j;indices.push(a,b,c,a,c,d)}
    indices.push(0,2,1,0,3,2,12,13,14,12,14,15);
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));geometry.setIndex(indices);geometry.computeVertexNormals();
    const mesh=new THREE.Mesh(geometry,mat(0xe62d43));mesh.castShadow=true;mesh.receiveShadow=true;car.add(mesh);
}
trackShell();
box(car,1.96,.13,3.5,0,.28,0,0x13141b); // carbon splitter and undertray
const cockpit=box(car,1.27,.52,1.19,0,.95,-.28,0x20232e);cockpit.rotation.x=-.13;
box(car,1.3,.10,.88,0,1.26,-.42,armor);
const windshield=box(car,1.13,.41,.035,0,1.02,.32,0x6b7887);windshield.rotation.x=-.48;
for(const x of [-.64,.64]) {
    box(car,.05,.36,.75,x,.98,-.27,0x677482);
    box(car,.17,.08,.29,x*1.56,.85,.18,0x191b23);
    box(car,.08,.07,.23,x*1.36,.62,1.34,trim);
    const lamp=box(car,.42,.07,.10,x,.55,1.61,0xffffff);lamp.rotation.z=x>0?-.13:.13;
    box(car,.46,.18,.10,x,.39,1.69,0x111219);
    const vent=box(car,.10,.27,.7,x*1.47,.61,-.10,0x111219);vent.rotation.z=x>0?-.15:.15;
    box(car,.08,.10,.9,x*1.45,.36,-.1,trim);
    box(car,.45,.065,.04,x,.65,-1.69,0xff5564);
}
// White center stripe, twin engine vents, diffuser and fixed rear wing.
box(car,.15,.025,1.13,0,.66,.89,trim).rotation.x=.16;
box(car,.15,.02,.87,0,1.32,-.42,trim);
for(const x of [-.4,.4])for(let i=0;i<4;i++)box(car,.45,.035,.08,x,.85,-.79-i*.15,0x191a22);
for(const x of [-.65,.65])box(car,.08,.43,.12,x,.99,-1.42,0x24252e);
box(car,2.23,.10,.48,0,1.24,-1.45,0x171820);
for(const x of [-1.08,1.08])box(car,.06,.25,.48,x,1.27,-1.45,armor);
for(const x of [-.5,0,.5])box(car,.06,.17,.34,x,.30,-1.7,0x111219);
const wheels=[];
for(const x of [-.96,.96])for(const z of [-1.03,1.08]) {
    const wheel=new THREE.Group();wheel.position.set(x,.40,z);car.add(wheel);
    const tire=cylinder(wheel,.39,.39,.28,0,0,0,0x101116,16);tire.rotation.z=Math.PI/2;
    const rim=cylinder(wheel,.26,.26,.30,0,0,0,0xababba,10);rim.rotation.z=Math.PI/2;
    const hub=cylinder(wheel,.11,.11,.32,0,0,0,armor,10);hub.rotation.z=Math.PI/2;
    for(let i=0;i<5;i++){const spoke=box(wheel,.33,.035,.43,0,0,0,0x313440);spoke.rotation.x=i*Math.PI/5;}
    wheels.push(wheel);
}
// Crisp comic ink edges on both playable models.
for(const model of [avatar,car])model.traverse(object=>{
    if(object.isMesh) {
        const ink=new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry,35),new THREE.LineBasicMaterial({color:0x07080c}));object.add(ink);
    }
});
const shadow = new THREE.Mesh(new THREE.CircleGeometry(.7, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .13, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .025; player.add(shadow);
function setMode(value) { mode = value; avatar.visible = mode === 'walk'; car.visible = mode === 'drive'; speed = 0; document.querySelector('#walk').classList.toggle('active', mode === 'walk'); document.querySelector('#drive').classList.toggle('active', mode === 'drive'); document.querySelector('#walk').setAttribute('aria-pressed', mode === 'walk'); document.querySelector('#drive').setAttribute('aria-pressed', mode === 'drive'); host.focus({ preventScroll: true }) }
document.querySelector('#walk').onclick = () => setMode('walk'); document.querySelector('#drive').onclick = () => setMode('drive'); document.querySelector('#reset').onclick = () => { clearInput(); player.position.set(0, .25, 6); host.focus({ preventScroll: true }) }; document.querySelector('#interact').onclick = () => { if (activeProject) projectDetails(activeProject) };
const movementKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight']); window.addEventListener('keydown', e => { if (dialog.open) return; if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return; if (movementKeys.has(e.code)) { e.preventDefault(); keys.add(e.code); destination = null } if (!e.repeat && e.code === 'KeyE' && activeProject) { e.preventDefault(); projectDetails(activeProject) } if (!e.repeat && e.code === 'KeyV') { e.preventDefault(); setMode(mode === 'walk' ? 'drive' : 'walk') } }); window.addEventListener('keyup', e => keys.delete(e.code)); window.addEventListener('blur', clearInput); document.addEventListener('visibilitychange', clearInput);
const joystick = document.querySelector('#joystick');
const joystickKnob = joystick.querySelector('.joystick-knob');
const stick = { x: 0, y: 0, pointer: null };
function resetJoystick() {
    stick.x = 0;
    stick.y = 0;
    const pointer = stick.pointer;
    stick.pointer = null;
    joystickKnob.style.transform = 'translate(-50%, -50%)';
    joystick.classList.remove('active');
    if (pointer !== null && joystick.hasPointerCapture(pointer)) joystick.releasePointerCapture(pointer);
}
function updateJoystick(event) {
    const bounds = joystick.getBoundingClientRect();
    const radius = bounds.width * .32;
    let x = event.clientX - bounds.left - bounds.width / 2;
    let y = event.clientY - bounds.top - bounds.height / 2;
    const distance = Math.hypot(x, y);
    if (distance > radius) { x *= radius / distance; y *= radius / distance; }
    const magnitude = Math.min(distance / radius, 1);
    const strength = magnitude < .12 ? 0 : (magnitude - .12) / .88;
    stick.x = distance ? x / Math.hypot(x, y) * strength : 0;
    stick.y = distance ? -y / Math.hypot(x, y) * strength : 0;
    joystickKnob.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
}
joystick.addEventListener('pointerdown', event => {
    if (dialog.open || stick.pointer !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    destination = null;
    stick.pointer = event.pointerId;
    joystick.setPointerCapture(event.pointerId);
    joystick.classList.add('active');
    updateJoystick(event);
});
joystick.addEventListener('pointermove', event => {
    if (event.pointerId !== stick.pointer) return;
    event.preventDefault();
    updateJoystick(event);
});
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    joystick.addEventListener(name, event => {
        if (event.pointerId === stick.pointer) { resetJoystick(); speed = 0; }
    });
}
joystick.addEventListener('contextmenu', event => event.preventDefault());
const raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -.25), hit = new THREE.Vector3(); renderer.domElement.addEventListener('pointerdown', e => { if (dialog.open) return; host.focus({ preventScroll: true }); mouse.set(e.clientX / innerWidth * 2 - 1, 1 - e.clientY / innerHeight * 2); raycaster.setFromCamera(mouse, camera); if (raycaster.ray.intersectPlane(plane, hit) && onTerrain(hit.x,hit.z)) destination = new THREE.Vector3(THREE.MathUtils.clamp(hit.x, -62, 62), .25, THREE.MathUtils.clamp(hit.z, -90, 54)) });
const forward = new THREE.Vector3(-offset.x, 0, -offset.z).normalize(), right = new THREE.Vector3(offset.z, 0, -offset.x).normalize(); const motion = new THREE.Vector3(), projected = new THREE.Vector3(); let previous = performance.now(), elapsed = 0;
function resize() { const aspect = innerWidth / innerHeight, size = Math.max(46, 46 / aspect), shift = innerWidth > 1000 ? -4 : 0; camera.left = -size * aspect + shift; camera.right = size * aspect + shift; camera.top = size + 3; camera.bottom = -size + 3; camera.updateProjectionMatrix();
    Object.assign(skyCamera,{left:camera.left,right:camera.right,top:camera.top,bottom:camera.bottom});skyCamera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight) } window.addEventListener('resize', resize); resize();
function frame(now) {
    requestAnimationFrame(frame); if (document.hidden) { previous = now; return } const skyDt = Math.max(0,(now - previous) / 1000); const dt = Math.min(skyDt, .04); previous = now; elapsed += dt; if (!reduced) { animateCity(elapsed); animateBoats(elapsed); } waterMaterial.uniforms.time.value = reduced ? 0 : elapsed; for (let i=0;i<shoreline.length;i++) shoreline[i].material.opacity = reduced ? .65 : .55 + Math.sin(elapsed*1.2+i)*.12;  motion.set(0, 0, 0); if (!dialog.open) { const horizontal = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft')) + stick.x; const vertical = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown')) + stick.y; motion.addScaledVector(right, horizontal).addScaledVector(forward, vertical); if (destination && !motion.lengthSq()) { motion.subVectors(destination, player.position); motion.y = 0; if (motion.length() < .25) { destination = null; motion.set(0, 0, 0) } } }
    const moving = motion.lengthSq() > .001; const maxSpeed = mode === 'drive' ? 15 : (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 13 : 9); speed = THREE.MathUtils.damp(speed, moving ? maxSpeed * (stick.pointer !== null && !keys.size ? Math.hypot(stick.x, stick.y) : 1) : 0, mode === 'drive' ? 5 : 12, dt); if (moving) { motion.normalize(); const oldX = player.position.x, oldZ = player.position.z; move(player.position, motion.x * speed * dt, motion.z * speed * dt, [...obstacles,...traffic.map(c=>({x:c.mesh.position.x,z:c.mesh.position.z,w:2.6,d:2.6}))], mode === 'drive' ? 1.8 : 1.15); if (destination && Math.hypot(player.position.x - oldX, player.position.z - oldZ) < .001) destination = null; const target = Math.atan2(motion.x, motion.z); player.rotation.y += Math.atan2(Math.sin(target - player.rotation.y), Math.cos(target - player.rotation.y)) * Math.min(1, dt * 12); phase += dt * speed * 2.2 }
    avatar.position.y = moving && !reduced ? Math.abs(Math.sin(phase)) * .07 : 0; legs.forEach((leg, i) => leg.rotation.x = moving ? Math.sin(phase + i * Math.PI) * .48 : 0); arms.forEach((arm, i) => arm.rotation.x = moving ? -Math.sin(phase + i * Math.PI) * .4 : 0); if (moving) wheels.forEach(w => w.rotation.x += dt * speed * 2.6);
    if (!reduced) for (const a of animated) { if (a.kind === 'agent') { a.mesh.position.x = Math.cos(a.a + elapsed * .18) * a.r; a.mesh.position.z = Math.sin(a.a + elapsed * .22) * a.r } else if (a.kind === 'cloud') a.mesh.position.x = Math.sin(elapsed * .55) * .15 }
    const wanted = new THREE.Vector3(player.position.x * .55, 0, -10 + player.position.z * .5); focus.lerp(wanted, reduced ? 1 : 1 - Math.exp(-dt * 2)); camera.position.copy(focus).add(offset); camera.lookAt(focus); camera.updateMatrixWorld(); animateClouds(skyDt);
    // Keep station labels away from each other and the fixed UI panels.
    const occupied = [];
    for (const selector of ['.topbar','.intro','.toolbar','.minimap','#nearby','.touch-pad']) {
        const element = document.querySelector(selector);
        if (!element || element.hidden) continue;
        const rect = element.getBoundingClientRect();
        if (rect.width && rect.height) occupied.push(rect);
    }
    for (const l of labels) {
        projected.copy(l.position).project(camera);
        const anchorX = (projected.x*.5+.5)*innerWidth, anchorY = (-projected.y*.5+.5)*innerHeight;
        const width = l.element.offsetWidth || 155, height = l.element.offsetHeight || 32;
        let placement = null;
        for (const [dx,dy] of [[0,0],[0,-36],[-55,-18],[55,-18],[0,-72],[-80,-52],[80,-52]]) {
            const x=anchorX+dx, y=anchorY+dy;
            const rect={left:x-width/2-5,right:x+width/2+5,top:y-height-5,bottom:y+5};
            if (rect.left<8 || rect.right>innerWidth-8 || rect.top<8 || rect.bottom>innerHeight-8) continue;
            if (occupied.some(r=>rect.left<r.right && rect.right>r.left && rect.top<r.bottom && rect.bottom>r.top)) continue;
            placement={x,y,rect}; break;
        }
        l.element.style.visibility = placement && projected.z<=1 && !dialog.open ? 'visible' : 'hidden';
        if (placement) { l.element.style.left=`${placement.x}px`; l.element.style.top=`${placement.y}px`; occupied.push(placement.rect); }
    }
    activeProject = nearestProject(player.position, stations); document.querySelector('#nearby').hidden = !activeProject || dialog.open; if (activeProject) document.querySelector('#nearby-title').textContent = activeProject.title; const dot = document.querySelector('#map-player'); dot.style.left = `${(player.position.x + 65) / 130 * 100}%`; dot.style.top = `${(player.position.z + 93) / 150 * 100}%`;
    renderer.autoClear=true;
    renderer.render(scene, camera);
    renderer.autoClear=false;
    renderer.clearDepth();
    renderer.render(skyScene,skyCamera);
    renderer.autoClear=true;
}
frame(performance.now()); document.querySelector('#loading').classList.add('hidden'); setTimeout(() => document.querySelector('#loading').remove(), 450);

