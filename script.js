const menuToggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menuToggle?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
const mode=document.getElementById('mode'),fields=document.getElementById('scheduleFields');
mode?.addEventListener('change',()=>{fields.hidden=!mode.value});
const form=document.getElementById('bookingForm');
form?.addEventListener('submit',e=>{
 e.preventDefault();
 const get=id=>document.getElementById(id)?.value?.trim()||'No especificado';
 const labels={
  mode:mode?.selectedOptions?.[0]?.textContent||'No especificada',
  format:get('format'),interest:get('interest'),day:get('day'),time:get('time')
 };
 const inputs=form.querySelectorAll('input');
 const name=inputs[0]?.value?.trim()||'No especificado';
 const phone=inputs[1]?.value?.trim()||'No especificado';
 const message=[
  'Hola MAV, quiero consultar por las propuestas de Diseño y Costura.',
  '', 'Mi nombre: '+name,'Mi WhatsApp: '+phone,
  'Modalidad: '+labels.mode,'Formato: '+labels.format,
  'Me interesa: '+labels.interest,'Día preferido: '+labels.day,
  'Horario preferido: '+labels.time,
  '', '¿Podemos coordinar una opción?'
 ].join('\n');
 const url='https://wa.me/5493512123856?text='+encodeURIComponent(message);
 window.open(url,'_blank','noopener,noreferrer');
});
