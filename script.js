const menuToggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menuToggle?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const mode=document.getElementById('mode'),fields=document.getElementById('scheduleFields'),day=document.getElementById('day'),time=document.getElementById('time');
const options={presencial:{days:['Martes','Jueves'],times:['09:00 a 12:00','15:00 a 18:00']},virtual:{days:['Lunes','Miércoles','Viernes'],times:['09:00 a 11:00','14:00 a 16:00','18:00 a 20:00']}};
mode?.addEventListener('change',()=>{
 const value=mode.value; fields.hidden=!value;
 day.innerHTML='<option value="">Elegí un día</option>';time.innerHTML='<option value="">Elegí un horario</option>';
 (options[value]?.days||[]).forEach(v=>day.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
 (options[value]?.times||[]).forEach(v=>time.insertAdjacentHTML('beforeend',`<option>${v}</option>`));
});
const form=document.getElementById('bookingForm'),toast=document.getElementById('toast');
form?.addEventListener('submit',e=>{e.preventDefault();toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),5000);form.reset();fields.hidden=true;day.innerHTML='<option value="">Elegí un día</option>';time.innerHTML='<option value="">Elegí un horario</option>';});
