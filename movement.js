// Pure movement functions, shared by the scene and unit checks.
export function canMove(x,z,obstacles,radius=.55){return Math.abs(x)<25.85-radius&&z>-41.85+radius&&z<23.85-radius&&!obstacles.some(o=>Math.abs(x-o.x)<o.w/2+radius&&Math.abs(z-o.z)<o.d/2+radius)}
export function move(position,dx,dz,obstacles,radius=.55){if(canMove(position.x+dx,position.z,obstacles,radius))position.x+=dx;if(canMove(position.x,position.z+dz,obstacles,radius))position.z+=dz;return position}
export function nearestProject(position,projects,radius=6){let best=null,distance=radius;for(const p of projects){const d=Math.hypot(position.x-p.x,position.z-(p.z+4.8));if(d<distance){distance=d;best=p}}return best}
