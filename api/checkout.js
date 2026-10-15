// Cria um checkout (Checkout Pro) no Mercado Pago e devolve a URL de pagamento.
// Depois de aprovado, o Mercado Pago redireciona o cliente para /briefing.html
// com ?payment_id=... (auto_return).
const PLANOS = require("./_planos");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return res.status(500).json({ erro: "MP_ACCESS_TOKEN não configurado" });

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }

  const plano = PLANOS[body.plano];
  if (!plano) return res.status(400).json({ erro: "Plano inválido" });

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const base = `https://${host}`;
  const ref = `smtech-${body.plano}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const r = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: body.plano, title: plano.titulo, quantity: 1, currency_id: "BRL", unit_price: plano.preco }],
        external_reference: ref,
        back_urls: {
          success: `${base}/briefing.html`,
          pending: `${base}/#planos`,
          failure: `${base}/#planos`
        },
        auto_return: "approved",
        statement_descriptor: "SM TECH"
      })
    });
    const d = await r.json();
    if (!r.ok || !d.init_point) {
      return res.status(502).json({ erro: "Falha ao criar checkout", detalhe: d && d.message });
    }
    return res.status(200).json({ url: d.init_point });
  } catch (e) {
    return res.status(502).json({ erro: "Erro ao falar com o Mercado Pago" });
  }
};
