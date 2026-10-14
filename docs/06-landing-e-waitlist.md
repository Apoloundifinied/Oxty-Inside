# 06 — Fase 0: Landing + Waitlist (detalhe operacional)

> A Fase 0 é um produto completo em si: ela existe para **medir demanda honestamente**. Espelha a estrutura da Fase 0 da Dozena (validada em produção E2E), com adaptações deste produto.

## 1. Objetivos mensuráveis
- Quantificar interesse: `waitlist` confirmada (double opt-in) ≥ **150 em 21 dias** (CONTEXT §11).
- Mapear demanda geográfica: eventos `city_check_covered` / `city_check_missing` dizem **quais municípios** o público quer (alimenta decisão de expansão e até prioridade de contribuição ao Querido Diário).
- Validar canais (Reddit vs WhatsApp vs indicação) via campo `source` + UTMs.

## 2. Anatomia da landing
Segue `03-fluxos-e-telas.md` Tela 1. Reforços específicos da Fase 0:
- **O widget "sua cidade está coberta?" é obrigatório acima da dobra**, ao lado do campo de e-mail. Ele é simultaneamente: demonstração do produto, coleta de demanda e filtro de expectativa honesta.
- **Prova real:** trecho de diário real da auditoria (ex.: nomeação em Niterói-RJ) com tarja "exemplo real de publicação". Proibido mockup genérico de dashboard aqui — o produto é o alerta, não um painel bonito.
- **Transparência de cobertura no hero:** linha discreta "hoje monitoramos ~800 municípios — confira o seu 👇" (liga ao widget). Nunca esconder o número.
- CTA Fase 0: "Entrar na lista de espera". **Nenhum botão de pagamento na Fase 0.**

## 3. Fluxo da waitlist
1. Usuário envia e-mail (+ cidade opcional + canal `source`).
2. Server action valida Zod + Turnstile → insert em `waitlist` (RLS insert-only).
3. Resend dispara e-mail de confirmação com link tokenizado.
4. Clique → `confirmed_at` preenchido → página `/obrigado` com o pedido qualitativo ("responde o e-mail e conta qual concurso você está esperando").
5. Falhas do Resend não quebram a inscrição: insert já aconteceu; reenvio fica disponível.

## 4. Anti-bot e qualidade
- Turnstile obrigatório (visão geral em `05`; chaves próprias do projeto, **não** reusar as da Dozena).
- Double opt-in = só `confirmed_at` conta para a meta do piso.
- Dedup por e-mail case-insensitive.

## 5. Analítico próprio (mesmo padrão da Dozena)
- `page_view` (landing, /cobertura), `cta_click`, `city_check_*`.
- Sem cookies, sem consent banner; se quiser complemento, `@vercel/analytics` é permitido (precedente ADR-016 da Dozena) — criar ADR aqui se adotar.

## 6. Copy — linhas prontas para adaptar (voz humana)
- Headline: **"Passou no concurso? Sua nomeação pode sair num diário que você nunca vai ler."**
- Sub: "A gente lê o Diário Oficial do seu município todos os dias e te avisa por e-mail na hora que seu nome aparecer." (ADR-013: sem Telegram no MVP)
- Widget: "Confere se já monitoramos a sua cidade 👇"
- Honestidade: "Se ainda não cobrimos, você entra numa lista e a gente te avisa quando começar. Sem enrolação."
- Preço-âncora: "Vai custar menos que um lanche por mês. A lista de espera é de graça."

## 7. Checklist de lançamento da Fase 0
- [ ] Landing + widget + /cobertura no ar em produção
- [ ] Waitlist salvando, confirmação por e-mail funcionando (teste manual E2E)
- [ ] Turnstile ativo
- [ ] Analítico gravando eventos (conferir 1 page_view real no banco)
- [ ] Smoke test documentado no CONTEXT §12
- [ ] Post de divulgação pronto seguindo `08-canais-e-voz.md`
