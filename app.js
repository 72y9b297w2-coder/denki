
const B=window.QUESTION_BANK,$=s=>document.querySelector(s);
const E={home:$("#home"),quiz:$("#quiz"),result:$("#result"),chapter:$("#chapter"),level:$("#level"),count:$("#count"),total:$("#total"),start:$("#start"),review:$("#review"),reset:$("#reset"),prog:$("#prog"),score:$("#score"),rate:$("#rate"),ch:$("#ch"),lv:$("#lv"),q:$("#q"),choices:$("#choices"),feedback:$("#feedback"),next:$("#next"),quit:$("#quit"),resultText:$("#resultText"),again:$("#again"),back:$("#back")};
[...new Set(B.map(x=>x.chapter))].forEach(x=>{const o=document.createElement("option");o.value=o.textContent=x;E.chapter.appendChild(o)});
E.total.textContent=`${B.length.toLocaleString()}問`;
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const getMisses=()=>JSON.parse(localStorage.getItem("denkiMisses")||"[]");
const setMisses=a=>localStorage.setItem("denkiMisses",JSON.stringify(a));
let S={};
function pool(){
 let p=B.filter(x=>(E.chapter.value==="all"||x.chapter===E.chapter.value)&&(E.level.value==="all"||x.level===E.level.value));
 return p.length?p:B;
}
function start(review=false){
 let p=review?B.filter(x=>getMisses().includes(x.id)):pool();
 if(!p.length){alert("まだ間違えた問題がありません。");return}
 const n=Number(E.count.value); let qs=[];
 while(qs.length<n){qs.push(...shuffle(p))}
 S={review,n,qs:qs.slice(0,n),i:0,correct:0,answered:false};
 E.home.classList.add("hidden");E.result.classList.add("hidden");E.quiz.classList.remove("hidden");show();
}
function show(){
 if(S.i>=S.n)return finish();
 const x=S.qs[S.i];S.current=x;S.answered=false;
 E.ch.textContent=x.chapter;E.lv.textContent=x.level;E.q.textContent=x.q;E.choices.innerHTML="";E.feedback.textContent="";E.feedback.className="feedback";E.next.classList.add("hidden");
 x.choices.forEach((c,i)=>{const b=document.createElement("button");b.className="choice";b.textContent=c;b.onclick=()=>answer(b,i);E.choices.appendChild(b)});
 stats();
}
function answer(btn,i){
 if(S.answered)return;S.answered=true;const x=S.current,ok=i===x.answer;
 let m=getMisses();
 if(ok){S.correct++;m=m.filter(id=>id!==x.id);E.feedback.className="feedback ok";E.feedback.textContent=`正解。${x.explanation}`}
 else{if(!m.includes(x.id))m.push(x.id);E.feedback.className="feedback ng";E.feedback.textContent=`正解：${x.choices[x.answer]}　${x.explanation}`}
 setMisses(m);
 [...E.choices.children].forEach((b,j)=>{b.disabled=true;if(j===x.answer)b.classList.add("correct")});if(!ok)btn.classList.add("wrong");
 E.next.classList.remove("hidden");stats();
}
function stats(){const done=S.i+(S.answered?1:0),rate=done?Math.round(S.correct/done*100):0;E.prog.textContent=`問題 ${S.i+1}/${S.n}`;E.score.textContent=`正解 ${S.correct}`;E.rate.textContent=`正答率 ${rate}%`}
function next(){S.i++;show()}
function finish(){const done=S.i+(S.answered?1:0),rate=done?Math.round(S.correct/done*100):0;E.quiz.classList.add("hidden");E.result.classList.remove("hidden");E.resultText.innerHTML=`${done}問中 ${S.correct}問正解<br>正答率 ${rate}%<br>復習待ち ${getMisses().length}問`}
function home(){E.quiz.classList.add("hidden");E.result.classList.add("hidden");E.home.classList.remove("hidden")}
E.start.onclick=()=>start(false);E.review.onclick=()=>start(true);E.next.onclick=next;E.quit.onclick=finish;E.again.onclick=()=>start(S.review);E.back.onclick=home;
E.reset.onclick=()=>{if(confirm("間違えた問題の記録を消しますか？")){localStorage.removeItem("denkiMisses");alert("記録を消しました。")}}
