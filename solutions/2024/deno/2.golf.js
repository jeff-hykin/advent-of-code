new Response(Deno.stdin.readable).text().then((a,b=0,v=0,z=w=>w.reduce(
(p,e,i,l,d=e-l[i-1])=>(i?(p.v+=
     !!((p.q==d>0)*d*(d<4&d>-4))):(p.q|=(l[i+1]-e)>0),a=i,p),{v:0,q:0}).v>=a)=>a.split`
`.map(e=>{e=e.split` `
v+=z(e)
b+=e.some((_,i,y)=>z(y.toSpliced(i,1)))})+console.log(v,b))