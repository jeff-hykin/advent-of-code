new Response(Deno.stdin.readable).text().then((a,c=0,s=0,t=0,d=0,f=a.replace(/l\((\d+),(\d+)\)|do(n?)/g,(_,a,b,e)=>a?(s+=t=a*b,c+=t*!d):d=e))=>console.log(s,c))