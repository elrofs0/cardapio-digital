# Liberação automática — Mercado Pago + Vercel

## Caminho rápido (2 cliques)

1. Pegue seu Access Token de produção em https://www.mercadopago.com.br/developers/panel/app (crie uma aplicação *Checkout Pro* se ainda não tiver). Não cole o token no chat.
2. Abra o link abaixo, entre com o GitHub, cole o token no campo `MP_ACCESS_TOKEN` e clique em Deploy:

https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Felrofs0%2Fcardapio-digital&env=MP_ACCESS_TOKEN&envDescription=Access%20Token%20de%20producao%20do%20Mercado%20Pago&project-name=sm-tech-atendimento

3. Quando terminar, abra `https://SEU-PROJETO.vercel.app/?teste=1`, contrate o plano Teste (R$ 1) e confira que o formulário abre sozinho depois de pagar.
4. Me mande o endereço da Vercel que eu troco os links dos anúncios.

O resto deste arquivo detalha o mesmo processo passo a passo.

---

Fluxo: cliente clica em **Contratar** → `/api/checkout` cria o pagamento no Mercado Pago →
cliente paga (Pix, cartão ou boleto) → Mercado Pago devolve para `/briefing.html?payment_id=...` →
`/api/verify` confere no Mercado Pago se o pagamento foi **aprovado** → o formulário é liberado sozinho.

Os preços ficam no servidor (`api/_planos.js`). O navegador nunca define o valor.

## Passo a passo (uma vez só)

1. **Credencial do Mercado Pago**
   - Acesse https://www.mercadopago.com.br/developers/panel/app e crie uma aplicação (tipo *Checkout Pro*).
   - Em *Credenciais de produção*, copie o **Access Token**. Ele é secreto: não vai para o GitHub, nem para o chat.

2. **Hospedagem na Vercel (grátis)**
   - Entre em https://vercel.com com a conta do GitHub.
   - *Add New → Project* → importe `elrofs0/cardapio-digital` → *Deploy* (sem alterar nada).

3. **Variável de ambiente**
   - Projeto → *Settings → Environment Variables* → nome `MP_ACCESS_TOKEN`, valor = o Access Token → *Save*.
   - *Deployments → Redeploy* para a variável valer.

4. **Teste de R$ 1**
   - Abra `https://SEU-PROJETO.vercel.app/?teste=1` e contrate o plano **Teste (R$ 1)**.
   - Pague. Ao voltar, o formulário deve abrir sozinho, mostrando "Plano: Teste".
   - Abrir `briefing.html` direto, sem pagar, deve mostrar "Pagamento não identificado".

5. **Divulgue só o endereço da Vercel.** O GitHub Pages não executa `/api`, então lá o formulário fica travado.

## Observações

- Se `/api/checkout` falhar, a landing cai no link manual (campo `linkPagamento` em `index.html`).
- O formulário envia o resumo por WhatsApp (fotos são enviadas na conversa depois).
- Quer receber aviso automático a cada pagamento? Dá para adicionar um webhook (`notification_url`) que avisa por e-mail ou WhatsApp.

## Instrução para o Claude Code

> Neste repositório, mantenha `api/` (funções serverless Node para Vercel), `index.html` e `briefing.html`.
> Não coloque o Access Token no código: ele só existe como variável de ambiente `MP_ACCESS_TOKEN`.
> Para mudar preços ou planos, edite `api/_planos.js` e os `planos` em `index.html` (ids iguais: `basico`, `completo`, `teste`).
> Para testar localmente sem tocar no Mercado Pago, simule `global.fetch` e chame `api/checkout.js` e `api/verify.js`.
