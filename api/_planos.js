// Fonte única dos planos e preços. Os preços são definidos AQUI (servidor),
// nunca confiamos no valor enviado pelo navegador.
module.exports = {
  basico:   { titulo: "Cardápio Digital + Catálogo WhatsApp - Plano Básico",   preco: 100 },
  completo: { titulo: "Cardápio Digital + Catálogo WhatsApp - Plano Completo", preco: 220 },
  teste:    { titulo: "TESTE - Cardápio Digital (R$ 1)",                        preco: 1 }
};
