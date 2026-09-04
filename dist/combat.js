export const STYLES={drunk:{name:'酔拳',en:'DRUNKEN FIST',skill:'酔仙連環脚',speed:2.45},wing:{name:'詠春拳',en:'WING CHUN',skill:'連環冲拳',speed:2.75}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const MOVE={drunk:{punch:{duration:.48,start:.17,range:1.85,damage:8,push:.20},kick:{duration:.9,start:.36,range:2.5,damage:17,push:.65},special:{duration:1.28,start:.27,range:2.9,damage:12,push:.40,hits:[.27,.53,.79]}},wing:{punch:{duration:.36,start:.1,range:1.7,damage:7,push:.13},kick:{duration:.7,start:.25,range:2.2,damage:14,push:.52},special:{duration:1.12,start:.17,range:2.1,damage:8,push:.13,hits:[.17,.31,.45,.59,.73]}}};
export function fighter(style,x){return{style,x,z:0,hp:100,energy:50,wins:0,yaw:x<0?0:Math.PI,action:null,stun:0,guard:false,moving:0,walk:0,combo:0,lastHit:-10,lastPunch:-10,chain:0,queued:false,flash:0,knock:0,aiDelay:0,ai:{x:0,z:0,guard:false},time:0};}
export class Fight{
 constructor(onEvent=()=>{},random=Math.random){this.onEvent=onEvent;this.random=random;this.p=fighter('drunk',-2.2);this.cpu=fighter('wing',2.2);this.phase='select';this.clock=60;this.round=1;this.elapsed=0;this.freeze=0;this.phaseTime=0;this.paused=false;}
 select(style){this.p=fighter(style,-2.2);this.cpu=fighter(style==='drunk'?'wing':'drunk',2.2);}
 start(style=this.p.style){this.select(style);this.round=1;this.resetRound();}
 resetRound(){for(const [i,f]of[this.p,this.cpu].entries()){const w=f.wins;Object.assign(f,fighter(f.style,i===0?-2.2:2.2));f.wins=w;}this.clock=60;this.phase='intro';this.phaseTime=2.25;this.paused=false;this.freeze=0;this.onEvent({type:'round',round:this.round});}
 attack(f,type){if(this.phase!=='fight'||this.paused||f.stun>0||f.hp<=0)return false;if(f.action){if(type==='punch'&&f.action.type==='punch'&&f.action.t>f.action.duration*.42)f.queued=true;return false;}if(type==='special'&&f.energy<100){if(f===this.p)this.onEvent({type:'notready'});return false;}if(type==='special')f.energy=0;
  const a={...MOVE[f.style][type],type,t:0,hit:new Set(),yaw:f.yaw,chain:type==='punch'&&this.elapsed-f.lastPunch<.8?(f.chain+1)%3:0};f.chain=a.chain;f.guard=false;f.action=a;f.queued=false;if(type==='punch')f.lastPunch=this.elapsed;
  this.onEvent({type:'attack',fighter:f,move:type});return true;}
 tick(dt,input={}){dt=clamp(dt,0,.04);if(this.paused)return;this.elapsed+=dt;for(const f of[this.p,this.cpu]){f.time+=dt;f.flash=Math.max(0,f.flash-dt);}
  if(this.phase==='select'||this.phase==='matchend')return;
  if(this.phase==='intro'){this.phaseTime-=dt;if(this.phaseTime<=0){this.phase='fight';this.onEvent({type:'fight'});}return;}
  if(this.phase==='roundend'){this.phaseTime-=dt;if(this.phaseTime<=0){if(this.p.wins===2||this.cpu.wins===2){this.phase='matchend';this.onEvent({type:'matchend',winner:this.p.wins===2?this.p:this.cpu});}else{this.round++;this.resetRound();}}return;}
  if(this.freeze>0){this.freeze-=dt;return;}this.clock=Math.max(0,this.clock-dt);
  this.updateAI(dt);const actions=[input,this.cpu.ai];
  for(let i=0;i<2;i++){const f=i?this.cpu:this.p,o=i?this.p:this.cpu,keys=actions[i];f.stun=Math.max(0,f.stun-dt);const target=Math.atan2(o.z-f.z,o.x-f.x);if(!f.action)f.yaw=target;
   f.guard=!!keys.guard&&!f.action&&f.stun<=0;f.moving=0;
   if(!f.action&&f.stun<=0){const len=Math.hypot(keys.x||0,keys.z||0),n=Math.max(1,len),speed=STYLES[f.style].speed*(f.guard?.3:1);f.x+=(keys.x||0)/n*speed*dt;f.z+=(keys.z||0)/n*speed*.72*dt;f.moving=len>0?1:0;f.walk+=dt*speed*len*3;}
   if(f.action){const a=f.action,old=a.t;a.t+=dt;
    if(a.type==='special'&&a.t<a.start){f.x+=Math.cos(a.yaw)*2.4*dt;f.z+=Math.sin(a.yaw)*2.4*dt;}
    const hits=a.hits||[a.start];for(let j=0;j<hits.length;j++){if(a.t>=hits[j]&&old<hits[j]+.13&&!a.hit.has(j)){const dx=o.x-f.x,dz=o.z-f.z,dist=Math.hypot(dx,dz),dot=dist>0?(Math.cos(a.yaw)*dx+Math.sin(a.yaw)*dz)/dist:1;if(dist<a.range&&dot>.83){a.hit.add(j);this.hit(f,o,a);}}}
    if(a.t>=a.duration){const q=f.queued;f.action=null;f.queued=false;if(q)this.attack(f,'punch');}
   }
  }
  let dx=this.cpu.x-this.p.x,dz=this.cpu.z-this.p.z,d=Math.hypot(dx,dz);if(d<1.05){if(d<.001){dx=1;dz=0;d=1;}const push=(1.05-d)/2;this.p.x-=dx/d*push;this.p.z-=dz/d*push;this.cpu.x+=dx/d*push;this.cpu.z+=dz/d*push;}
  if(this.p.hp<=0||this.cpu.hp<=0)this.endRound(this.p.hp===this.cpu.hp?null:this.p.hp>this.cpu.hp?this.p:this.cpu,'K.O.');
  else if(Math.abs(this.p.x)>6.55||Math.abs(this.p.z)>4.45)this.endRound(this.cpu,'RING OUT');else if(Math.abs(this.cpu.x)>6.55||Math.abs(this.cpu.z)>4.45)this.endRound(this.p,'RING OUT');
  else if(this.clock<=0)this.endRound(this.p.hp===this.cpu.hp?null:this.p.hp>this.cpu.hp?this.p:this.cpu,'TIME UP');
 }
 hit(f,o,a){const blocked=o.guard&&a.type!=='special';let damage=a.damage;if(a.chain===2)damage+=3;if(blocked)damage=1;const counter=!!o.action&&!blocked;o.hp=Math.max(0,o.hp-damage);f.energy=clamp(f.energy+(blocked?5:damage*.9),0,100);o.energy=clamp(o.energy+damage*.95,0,100);o.flash=blocked?.1:.18;o.knock=blocked?.2:1;o.stun=blocked?.08:(a.type==='kick'?.30:.19);if(!blocked){o.action=null;o.queued=false;}const power=blocked?a.push*.35:a.push;o.x+=Math.cos(a.yaw)*power;o.z+=Math.sin(a.yaw)*power;this.freeze=blocked?.025:.047;if(!blocked){f.combo=this.elapsed-f.lastHit<1.15?f.combo+1:1;f.lastHit=this.elapsed;}this.onEvent({type:'hit',fighter:f,target:o,blocked,counter,combo:f.combo,special:a.type==='special'});}
 endRound(winner,reason){if(this.phase!=='fight')return;this.phase='roundend';this.phaseTime=3.2;if(winner)winner.wins++;for(const f of[this.p,this.cpu]){f.action=null;f.guard=false;f.moving=0;}this.onEvent({type:'roundend',winner,reason});}
 updateAI(dt){const f=this.cpu,o=this.p;f.aiDelay-=dt;if(f.aiDelay>0)return;f.aiDelay=.19+this.random()*.25;const dx=o.x-f.x,dz=o.z-f.z,d=Math.hypot(dx,dz),r=this.random();f.ai={x:0,z:0,guard:false};if(f.action||f.stun>0)return;
  if(Math.abs(f.x)>5.6||Math.abs(f.z)>3.7){f.ai.x=-f.x/Math.max(1,Math.abs(f.x));f.ai.z=-f.z/Math.max(1,Math.abs(f.z));if(d<2)f.ai.guard=true;return;}
  if(d>2.05){f.ai.x=dx/Math.max(d,.1);f.ai.z=dz/Math.max(d,.1);return;}
  if(o.action&&o.action.t>.08&&r<.57){f.ai.guard=true;return;}
  if(r<.14){f.ai.x=-dx/d*.5;f.ai.z=(this.random()-.5)*2;return;}
  if(r<.28){f.ai.guard=true;return;}
  if(f.energy>=100&&r<.65){this.attack(f,'special');return;}if(r<.70){if(d<1.75)this.attack(f,'punch');else{f.ai.x=dx/d;f.ai.z=dz/d;}}else this.attack(f,'kick');
 }
}
