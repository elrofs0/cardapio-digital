// Confirma no Mercado Pago se o pagamento foi aprovado.
// Só aceita pagamentos recebidos NA SUA CONTA (o token é seu) e criados por /api/checkout
// (external_reference começando com "smtech-<plano>-") com valor igual ou maior que o do plano.
const PLANOS = require("./_planos");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return res.status(500).json({ ok: false, erro: "MP_ACCESS_TOKEN não configurado" });

  const id = String((req.query && req.query.payment_id) || "").replace(/\D/g, "");
  if (!id) return res.status(400).json({ ok: false, erro: "payment_id ausente" });

  try {
    const r = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!r.ok) return res.status(404).json({ ok: false, erro: "Pagamento não encontrado" });
    const p = await r.json();

    const m = /^smtech-(basico|completo|teste)-/.exec(p.external_reference || "");
    if (!m) return res.status(403).json({ ok: false, erro: "Pagamento não pertence a este serviço" });

    const plano = m[1];
    const ok = p.status === "approved" && Number(p.transaction_amount) >= PLANOS[plano].preco;
    return res.status(ok ? 200 : 402).json({ ok, plano, status: p.status });
  } catch (e) {
    return res.status(502).json({ ok: false, erro: "Erro ao falar com o Mercado Pago" });
  }
};
