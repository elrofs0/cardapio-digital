// Fonte única dos planos e preços. Os preços são definidos AQUI (servidor),
// nunca confiamos no valor enviado pelo navegador.
module.exports = {
  basico:   { titulo: "Atendimento Automático WhatsApp - Plano Básico",   preco: 100 },
  completo: { titulo: "Atendimento Automático WhatsApp - Plano Completo", preco: 220 },
  teste:    { titulo: "TESTE - Atendimento Automático (R$ 1)",                        preco: 1 }
};
