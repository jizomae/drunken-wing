import{mat,color}from'./engine.js';
let seed=7231;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
export class Scene{
 constructor(renderer){this.r=renderer;this.static=[];this.lanterns=[];this.leaves=[];this.particles=[];this.camera=[1.5,5.3,13.8];this.target=[0,1,0];this.shake=0;this.build();}
 add(type,p,s,c,rot=[0,0,0],unlit=0){this.static.push({type,m:mat.transform(p,s,rot),c:color(c),unlit});}
 build(){const add=(...a)=>this.add(...a);
  // A cedar platform, fine plank seams, brass perimeter, and shallow steps.
  add('box',[0,-.55,0],[14.3,.8,10.2],'#343c33');add('box',[0,-.19,0],[13.8,.2,9.6],'#7c745c');add('box',[0,-.06,0],[13.2,.12,9.0],'#a89470');
  for(let i=0;i<22;i++){const x=-6.3+i*.6;add('box',[x,.005,0],[.585,.035,8.8],['#a18c66','#b09b75','#ac966e','#bba57c'][i%4]);for(let j=0;j<3;j++)add('box',[x,.03,-3+j*3+(i%2)*.7],[.584,.004,.012],'#736748');}
  for(const x of[-6.53,6.53])add('box',[x,.045,0],[.06,.03,8.9],'#ddbd79');for(const z of[-4.43,4.43])add('box',[0,.045,z],[13.1,.03,.06],'#ddbd79');
  for(let i=0;i<4;i++)add('box',[0,-.22-i*.21,5.0+i*.48],[4.8,.23,.55],i%2?'#737566':'#848473');
  // Quiet, broad circular inlay in the platform.
  for(let i=0;i<72;i++){const a=i/72*Math.PI*2;add('box',[Math.cos(a)*2.72,.029,Math.sin(a)*2.72],[.24,.005,.025],'#7b78584f',[0,-a-Math.PI/2,0]);}
  add('box',[0,-1.05,0],[110,.15,100],'#556452');
  // Layered, misty mountain silhouettes.
  for(let i=0;i<16;i++){const x=-47+i*6.2,z=-34-rand()*15,h=9+rand()*15;add('mountain',[x,h/2-1,z],[9+rand()*8,h,7+rand()*6],i%3?'#71867a':'#617e72',[0,rand()*6,0]);}
  for(let i=0;i<9;i++){const x=-33+i*8;add('mountain',[x,2.5,-21-rand()*5],[7,8+rand()*6,6],'#537266',[0,rand()*6,0]);}
  // Back courtyard wall with coping and inset panels.
  add('box',[0,.7,-8.5],[35,3.5,.55],'#a5a68a');add('box',[0,2.5,-8.5],[35,.22,.9],'#414f45');add('box',[0,-.45,-8.1],[35,.5,.5],'#526354');
  for(let x=-16;x<=16;x+=4){add('box',[x,1,-8.13],[.24,3,.2],'#718675');if(Math.abs(x)>5){add('box',[x+1.9,1.2,-8.15],[2.8,1.6,.08],'#728a77');for(let j=0;j<5;j++)add('box',[x+.85+j*.5,1.2,-8.05],[.065,1.5,.06],'#455e51');}}
  // Traditional timber pavilion, layered tiled roof with upturned eaves.
  for(const x of[-5.8,5.8])for(const z of[-7.1,-11]){add('cylinder',[x,1.3,z],[.27,4.6,.27],'#623d2c');add('cylinder',[x,-.65,z],[.43,.4,.43],'#797d6b');add('box',[x,3.2,z],[.72,.25,.72],'#886445');}
  add('box',[0,3.25,-8.8],[12.4,.4,4.5],'#62462f');
  for(const sign of[-1,1]){add('box',[0,4.1,-8.8+sign*1.55],[14,.22,4.4],'#3c5047',[sign*.28,0,0]);add('box',[0,3.66,-8.8+sign*3.5],[14.8,.18,.75],'#40594c',[-sign*.14,0,0]);add('box',[0,4.79,-8.8],[14,.14,.21],'#657564');for(let i=0;i<39;i++)add('cylinder',[-6.85+i*.36,4.17,-8.8+sign*1.7],[.07,4.55,.07],'#596f5d',[Math.PI/2+sign*.28,0,0]);}
  for(const x of[-7.1,7.1]){add('box',[x,4.88,-8.8],[.8,.15,.22],'#6b7a60',[0,0,x>0?.3:-.3]);}
  // Sign board and lattice doors behind the arena.
  add('box',[0,2.94,-6.85],[2.7,.78,.16],'#273f34');add('box',[0,2.97,-6.75],[2.48,.55,.06],'#927945');
  for(const x of[-3.4,3.4]){add('box',[x,.65,-8.0],[2.65,3.25,.12],'#345246');for(let j=0;j<7;j++)add('box',[x-1.12+j*.37,.65,-7.9],[.055,3.15,.055],'#b09361');for(let j=0;j<7;j++)add('box',[x,-.64+j*.45,-7.87],[2.5,.045,.055],'#997f55');}
  // Stone lanterns along the stage, with warm interiors.
  for(const x of[-8.0,8.0])for(const z of[-4,3]){add('box',[x,-.55,z],[1.3,.7,1.3],'#586354');add('box',[x,.2,z],[.5,1,.5],'#85917a');add('box',[x,.8,z],[1.05,.2,1.05],'#828d75');add('box',[x,1.27,z],[.62,.76,.62],'#dfb15e',undefined,.55);for(const sx of[-1,1])for(const sz of[-1,1])add('box',[x+sx*.4,1.27,z+sz*.4],[.16,.85,.16],'#647661');add('cone',[x,1.88,z],[.95,.7,.95],'#5e725d',[0,Math.PI/4,0]);}
  // Hanging vermilion lanterns.
  for(const x of[-5.1,5.1]){add('cylinder',[x,2.72,-6.4],[.018,.8,.018],'#453f2c');this.lanterns.push([x,2.1,-6.4]);}
  // Trees with faceted autumn crowns.
  for(const [x,z,size]of[[-10,-6,1.25],[11,-8,1.1],[-13,3,.95],[15,-4,1.1]]){add('cylinder',[x,1.1,z],[.35,4.5,.4],'#4b4932',[0,0,.08]);for(let j=0;j<7;j++){const a=j*2.399,xx=x+Math.cos(a)*1.4*size,zz=z+Math.sin(a)*1.3*size,yy=3.5+rand()*1.6;add('cylinder',[(x+xx)/2,2.4,(z+zz)/2],[.14,2.1,.14],'#57583b',[Math.sin(a)*.6,0,Math.cos(a)*-.6]);add('sphere',[xx,yy,zz],[2.1*size,1.1*size,1.6*size],['#a96737','#bb783d','#cb8d44','#996033'][j%4],[0,a,0]);}}
  // Bamboo on either side.
  for(const side of[-1,1])for(let i=0;i<14;i++){const x=side*(11+rand()*6),z=-12+rand()*6,h=3+rand()*5;add('cylinder',[x,h/2-1,z],[.07,h,.07],'#577d50',[0,0,(rand()-.5)*.14]);for(let j=0;j<3;j++)add('sphere',[x+(rand()-.5)*1.2,h*.55+j*.6,z],[1.2,.10,.32],'#456f4a',[0,rand()*6,(rand()-.5)*.5]);}
  // Rocks and tufts beyond the raised edge.
  for(let i=0;i<20;i++){const side=i%2?-1:1,x=side*(7.5+rand()*7),z=-6+rand()*13;add('sphere',[x,-.62,z],[.3+rand()*.7,.2+rand()*.5,.4+rand()*.7],'#687967',[rand(),rand(),rand()]);}
  for(let i=0;i<27;i++)this.leaves.push({x:(rand()-.5)*25,y:rand()*10,z:(rand()-.5)*18,s:rand()*.7+ .4,t:rand()*10});
 }
 spark(event){const f=event.target;this.shake=event.blocked?.025:event.special?.11:.075;for(let i=0;i<(event.blocked?7:15);i++){const a=rand()*Math.PI*2,s=.7+rand()*2.5;this.particles.push({x:f.x-Math.cos(f.yaw)*.15,y:1.5+rand()*.4,z:f.z,vx:Math.cos(a)*s,vy:rand()*2.6,vz:Math.sin(a)*s,life:.2+rand()*.24,max:.5,c:event.blocked?'#c8ecdb':'#ffdda0'});}}
 render(fight,dt){const r=this.r,t=fight.elapsed,selection=fight.phase==='select';const aspect=r.aspect;const mx=(fight.p.x+fight.cpu.x)/2,mz=(fight.p.z+fight.cpu.z)/2,dist=Math.hypot(fight.p.x-fight.cpu.x,fight.p.z-fight.cpu.z);
  const zoom=aspect<.85?1.55:aspect<1.3?1.15:1;const targetCam=[mx*.45+1.0,(selection?5.2:4.7)*zoom,(selection?14.6:Math.max(12.6,dist*1.42+6))*zoom+mz*.22];const cameraTarget=[mx*.65,selection?-.0:.85,mz*.48];const smooth=1-Math.exp(-dt*3);for(let i=0;i<3;i++){this.camera[i]+=(targetCam[i]-this.camera[i])*smooth;this.target[i]+=(cameraTarget[i]-this.target[i])*smooth;}this.shake*=Math.exp(-dt*16);const eye=this.camera.map((v,i)=>v+(i!==1?(rand()-.5)*this.shake:0));r.begin(eye,this.target);
  for(const item of this.static)r.mesh(item.type,item.m,item.c,item.unlit);
  for(const [x,y,z]of this.lanterns){const a=Math.sin(t*.8+x)*.035;r.draw('sphere',[x+Math.sin(a)*.5,y,z],[.35,.47,.35],'#b66039',[0,0,a]);for(const yy of[-.43,.43])r.draw('cylinder',[x,y+yy,z],[.2,.08,.2],'#493e25');r.draw('cylinder',[x,y-.67,z],[.025,.45,.025],'#cc864b');}
  this.drawFighter(fight.p,t,true,fight);this.drawFighter(fight.cpu,t,true,fight);
  this.drawFighter(fight.p,t,false,fight);this.drawFighter(fight.cpu,t,false,fight);
  for(const leaf of this.leaves){leaf.y-=dt*.37*leaf.s;leaf.x+=dt*.17;if(leaf.y<-.8){leaf.y=9;leaf.x=(rand()-.5)*23;}r.draw('box',[leaf.x+Math.sin(t+leaf.t)*.3,leaf.y,leaf.z],[.10*leaf.s,.008,.18*leaf.s],'#bd9453',[t+leaf.t,t*.7,leaf.t]);}
  this.particles=this.particles.filter(p=>p.life>0);for(const p of this.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=dt*6;const c=color(p.c);c[3]=Math.max(0,p.life/p.max);r.draw('box',[p.x,p.y,p.z],[.055,.055,.055],c,[t*12,t*6,0],null,1);}
 }
 drawFighter(f,t,shadow,fight){const r=this.r,d=f.style==='drunk',a=f.action;let root=mat.mul(mat.translate(f.x,0,f.z),mat.ry(-f.yaw));let falling=(fight.phase==='roundend'||fight.phase==='matchend')&&(f.hp<=0||Math.abs(f.x)>6.55||Math.abs(f.z)>4.45);if(falling){root=mat.mul(root,mat.mul(mat.translate(-.45,.20,0),mat.rz(1.38)));}
  if(shadow){const s=mat.identity();s[4]=-.48;s[5]=.002;s[6]=-.27;s[13]=.043;root=mat.mul(s,root);}
  const normalCloth=d?'#727b51':'#8d493b',skin=d?'#d0a67f':'#dfb58b',pants=d?'#c6c1a5':'#354944',hair=d?'#d2cfc0':'#242f2b',wraps=d?'#b6aa85':'#c8c4a9',gold=d?'#bd873b':'#b79258';const hit=f.flash>0&&!f.guard;const c=co=>shadow?[.13,.18,.13,.38]:hit?color(co).map((v,i)=>i===3?1:Math.min(1,v*.7+.3)):co;
  const mesh=(type,p,s,co,rot=[0,0,0])=>r.draw(type,p,s,c(co),rot,root,shadow?1:0),bone=(aa,b,rad,co)=>{if(shadow){const g=r.bone.bind(r);g(aa,b,rad,c(co),root);}else r.bone(aa,b,rad,c(co),root);};
  const idle=Math.sin(t*(d?2.5:3.3)+(d?0:1)),bob=f.moving?Math.abs(Math.sin(f.walk))*.07:Math.sin(t*3)*.025;let sway=d?Math.sin(t*1.65)*.12:Math.sin(t*2)*.016;let lean=d?-.16:-.015;let hipY=1.02+bob;
  let frontFoot=[.47,.10,-.26],rearFoot=[-.43,.10,.27],frontKnee=[.37,.51,-.26],rearKnee=[-.40,.52,.27];
  if(f.moving){const step=Math.sin(f.walk)*.27;frontFoot[0]+=step;rearFoot[0]-=step;frontFoot[1]+=Math.max(0,Math.cos(f.walk))*.13;rearFoot[1]+=Math.max(0,-Math.cos(f.walk))*.13;frontKnee[0]+=step*.7;rearKnee[0]-=step*.7;}
  let elbows=[[.08,1.45,-.47],[.10,1.38,.46]],hands=d?[[.64,1.66+idle*.08,-.40],[.50,1.70-idle*.06,.35]]:[[.70,1.63,-.23],[.49,1.80,.17]];
  if(f.guard){lean=-.08;hands=[[.57,1.99,-.14],[.52,1.90,.16]];elbows=[[.20,1.48,-.32],[.18,1.44,.32]];}
  if(a){const p=a.t/a.duration;
   if(a.type==='punch'){const hitAt=a.start/a.duration,wind=Math.max(0,1-Math.abs(p-hitAt)/.23),side=a.chain%2;hands[side]=[.60+wind*.9,1.75,-.18+side*.36];elbows[side]=[.24+wind*.62,1.62,-.30+side*.6];lean=wind*.20;sway+=wind*.13;if(a.chain===2){hands[side][1]=1.4+wind*.55;hipY-=.10*(1-wind);}}
   if(a.type==='kick'){const pulse=Math.sin(Math.PI*Math.min(1,p/.8));lean=-pulse*.33;sway-=pulse*.12;frontKnee=[.4+pulse*.65,.54+pulse*.76,-.20];frontFoot=[.50+pulse*1.50,.1+pulse*1.30,-.16];hands=[[.18,1.91,-.46],[-.2,1.63,.46]];}
   if(a.type==='special'){if(d){const pulse=Math.max(0,Math.sin(a.t*12));root=mat.mul(root,mat.ry(-Math.PI*2*p));hipY-=.15;lean=-.25;frontKnee=[.75,.93,-.2];frontFoot=[1.35+pulse*.45,1.25,-.16];hands=[[-.3,1.87,-.62],[.35,1.81,.60]];}else{const pulse=Math.sin(a.t*44);hands=[[1.05+Math.max(0,pulse)*.6,1.73,-.13],[1.05+Math.max(0,-pulse)*.6,1.74,.13]];elbows=[[.69,1.52,-.20],[.69,1.51,.20]];lean=.20;sway=.14;}}
  }
  if(f.stun>0&&!f.guard){lean=-.25;hands=[[.1,1.45,-.57],[-.2,1.46,.55]];}
  const hip=[sway,hipY,0],chest=[sway+lean,hipY+.60,0],neck=[chest[0],hipY+.96,0],head=[neck[0]+.025,hipY+1.17,0];
  // Split trousers and shoes make every kick readable.
  bone([hip[0],hipY,-.19],frontKnee,d?.21:.16,pants);bone(frontKnee,frontFoot,d?.16:.12,pants);bone([hip[0],hipY,.19],rearKnee,d?.21:.16,pants);bone(rearKnee,rearFoot,d?.16:.12,pants);
  for(const foot of[frontFoot,rearFoot]){mesh('box',[foot[0]+.07,foot[1]-.015,foot[2]],[.43,.17,.24],'#28352e',[0,0,-.03]);mesh('box',[foot[0]+.08,foot[1]-.085,foot[2]],[.44,.035,.25],'#a9a98a');}
  mesh('sphere',hip,[.29,.23,.32],pants);mesh('cylinder',[hip[0]+lean*.45,hipY+.34,0],[.34,.69,.42],normalCloth,[0,0,-lean*.6]);mesh('sphere',[chest[0],chest[1]-.09,0],[.31,.26,.41],normalCloth);mesh('cylinder',[hip[0],hipY+.06,0],[.35,.14,.41],gold);
  // Open vest or a fitted tunic with a center fastening.
  if(d){mesh('box',[chest[0]+.27,hipY+.54,0],[.035,.53,.15],skin,[0,0,-lean*.7]);mesh('box',[hip[0]+.02,hipY-.24,.26],[.10,.49,.13],gold,[0,0,-.17]);}
  else{for(let i=0;i<4;i++)mesh('box',[chest[0]+.315,hipY+.30+i*.13,.035],[.025,.026,.15],'#d3b98b');mesh('cylinder',[neck[0],neck[1]-.1,0],[.15,.17,.17],normalCloth);}
  bone([neck[0],neck[1]-.12,0],neck,.11,skin);
  for(let i=0;i<2;i++){const sign=i?1:-1,shoulder=[chest[0],chest[1]-.03,sign*.37];mesh('sphere',shoulder,[.18,.18,.18],normalCloth);bone(shoulder,elbows[i],d?.135:.13,d?skin:normalCloth);mesh('sphere',elbows[i],[.13,.13,.13],d?skin:normalCloth);bone(elbows[i],hands[i],.105,skin);const wrist=elbows[i].map((v,j)=>v+(hands[i][j]-v)*.77);bone(wrist,hands[i],.118,wraps);mesh('sphere',hands[i],[.135,.13,.135],skin);}
  mesh('sphere',head,[.235,.285,.225],skin,[0,0,-lean*.25]);mesh('sphere',[head[0]-.047,head[1]+.105,0],[.225,.20,.23],hair);mesh('sphere',[head[0]+.225,head[1]-.035,0],[.085,.075,.065],skin);for(const side of[-1,1]){mesh('sphere',[head[0]-.02,head[1]-.03,side*.23],[.07,.09,.04],skin);mesh('box',[head[0]+.209,head[1]+.035,side*.083],[.02,.038,.052],'#32382c');mesh('box',[head[0]+.209,head[1]+.081,side*.087],[.025,.027,.075],hair,[side*.12,0,0]);}
  if(d){mesh('cone',[head[0]+.13,head[1]-.30,0],[.12,.37,.15],hair,[0,0,Math.PI]);mesh('sphere',[head[0]-.12,head[1]+.32,0],[.10,.115,.10],hair);mesh('box',[head[0]+.229,head[1]-.118,0],[.03,.055,.18],hair);const gx=hip[0]-.19,gz=.52;mesh('sphere',[gx,hipY-.22,gz],[.14,.18,.14],'#a1713e');mesh('sphere',[gx,hipY+.01,gz],[.10,.12,.10],'#ad7a44');mesh('cylinder',[gx,hipY+.14,gz],[.045,.09,.045],'#554733');}
  else{mesh('sphere',[head[0]-.24,head[1]+.12,0],[.15,.15,.15],hair);mesh('cylinder',[head[0]-.20,head[1]+.18,0],[.06,.37,.06],'#b5a375',[Math.PI/2,0,.25]);}
 }
}
