// Catálogo de workbooks. Fuente de verdad de precios: el servidor cobra con estos valores,
// nunca con los que llegan desde el navegador.
const PRODUCTS = {
  w1: { title: 'Workbook 01 · Mi primer encuentro con la costura', price: 7900, file: 'PDF_URL_W1' },
  w2: { title: 'Workbook 02 · Conozco y uso mi máquina', price: 8900, file: 'PDF_URL_W2' },
  w3: { title: 'Workbook 03 · Medidas, moldes y corte', price: 9900, file: 'PDF_URL_W3' },
  w4: { title: 'Workbook 04 · De la idea a lo hecho a mano', price: 9900, file: 'PDF_URL_W4' },
  pack: {
    title: 'Pack completo · 4 workbooks',
    price: 29900,
    file: null,
    includes: ['w1', 'w2', 'w3', 'w4'],
  },
};

module.exports = { PRODUCTS };
