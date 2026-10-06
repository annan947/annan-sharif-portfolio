// Shared terrain and movement for the island, bridges, and city.
export function onTerrain(x,z) {
 return (Math.abs(x)<27.8 && z>-43.8 && z<25.8) ||
 (Math.abs(x)>39.5 && Math.abs(x)<64.3 && z>-65.3 && z<45.3) ||
 (Math.abs(x)<64.3 && ((z>-91.8 && z<-54) || (z>36 && z<55.8))) ||
 (Math.abs(x)<4 && ((z>-55 && z<-43) || (z>25 && z<37))) ||
 (Math.abs(z)<4 && Math.abs(x)>27 && Math.abs(x)<41);
}
export function canMove(x,z,obstacles,radius=.55){return [-radius,0,radius].every(dx=>[-radius,0,radius].every(dz=>onTerrain(x+dx,z+dz)))&&!obstacles.some(o=>Math.abs(x-o.x)<o.w/2+radius&&Math.abs(z-o.z)<o.d/2+radius)}
export function move(position,dx,dz,obstacles,radius=.55){if(canMove(position.x+dx,position.z,obstacles,radius))position.x+=dx;if(canMove(position.x,position.z+dz,obstacles,radius))position.z+=dz;return position}
export function nearestProject(position,projects,radius=6){let best=null,distance=radius;for(const p of projects){const d=Math.hypot(position.x-p.x,position.z-(p.z+4.8));if(d<distance){distance=d;best=p}}return best}
