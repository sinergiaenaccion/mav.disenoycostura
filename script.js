// MAV Diseño & Costura: menú móvil y consulta por WhatsApp.
// VERIFICAR antes de publicar: número de WhatsApp oficial de MAV.
const WHATSAPP_NUMBER = '5493512123856';

(function () {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('open', open);
  }

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  const form = document.getElementById('consulta-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('error');

    const data = new FormData(form);
    const modalidad = data.get('modalidad');
    const interes = (data.get('interes') || '').trim();
    const nombre = (data.get('nombre') || '').trim();
    const mensaje = (data.get('mensaje') || '').trim();

    const problems = [];
    if (!modalidad) problems.push('elegí una modalidad');
    if (!interes) problems.push('elegí qué te interesa');
    if (!nombre) problems.push('escribí tu nombre');

    if (problems.length) {
      status.textContent = 'Para enviar la consulta, ' + problems.join(', ') + '.';
      status.classList.add('error');
      const firstInvalid = !modalidad ? form.querySelector('input[name="modalidad"]')
        : !interes ? document.getElementById('interes')
        : document.getElementById('nombre');
      firstInvalid.focus();
      return;
    }

    const lines = [
      'Hola MAV, quiero consultar.',
      'Me llamo ' + nombre + '.',
      'Modalidad: ' + modalidad + '.',
      'Me interesa: ' + interes + '.'
    ];
    if (mensaje) lines.push('Comentario: ' + mensaje);

    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
    status.textContent = 'Se abrió WhatsApp con tu consulta. Si no se abrió, usá el botón "Escribir por WhatsApp".';
  });
})();
