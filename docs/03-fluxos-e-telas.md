# 03 — Fluxos e Telas (sem código)

> Descreve cada tela pelo seu objetivo, blocos e decisões. O agente que implementar deve resolver estilos livremente dentro do Tailwind, sem fugir destes blocos.

## Mapa de rotas
```
/                     landing pública (waitlist na Fase 0; vira landing de venda no MVP)
/cobertura            "O que cobrimos" — lista pública pesquisável de municípios
/entrar               login (magic link)
/obrigado             pós-waitlist / pós-pagamento
/app                  painel (autenticado)
/app/watchlists       lista + criar/editar watchlist
/app/alertas          histórico de matches
/app/assinatura       plano, status, gerenciar (link do portal Cakto)
/termos · /privacidade
```

## Tela 1 — `/` Landing
**Objetivo:** 10 segundos para entender, 20 para entrar na waitlist.
Blocos, em ordem:
1. **Hero:** headline da dor ("Passou no concurso? Sua nomeação pode sair num diário que você nunca vai ler."). Subheadline simples. CTA: e-mail + botão "Quero ser avisado na minha cidade".
2. **Seletor de cidade inline:** campo "qual município?" com autocomplete → resposta imediata: ✅ "Monitoramos <cidade>" (já ganhou confiança) ou 🟡 "Ainda não — deixe seu e-mail que avisamos quando começarmos". **Este widget é o coração da landing.**
3. **Como funciona:** 3 passos em linguagem do público (doc 01 §5): "você cadastra seu nome → a gente lê o diário todo dia → se seu nome aparecer, você recebe um e-mail na hora".
4. **Prova de realidade:** print de um trecho real de diário com um nome real (dos excerpts da auditoria), com tarja "exemplo real".
5. **Preço-âncora suave:** "menos que um lanche por mês" (sem botão de compra na Fase 0 — ADR-007; no MVP vira CTA de assinar).
6. **FAQ curto:** cobre meu município? (link /cobertura) · e se eu for chamado e cancelar? (ótimo, é o objetivo) · isso é garantia? (não, é leitura automatizada + alerta — disclaimer).
7. **Rodapé:** disclaimer jurídico, termos, privacidade, "feito com dados do Querido Diário" (atribuição à OKBR).

**Regras de copy:** voz humana (doc 08). Sem tricolon. PT-BR coloquial respeitoso.

## Tela 2 — `/cobertura`
Busca + lista alfabetizada por UF dos municípios monitorados (espelho do `/cities` da API, nível ≥ 1), com contagem honesta ("cobrimos X municípios; o Brasil tem 5.570 — estamos expandindo junto com o Querido Diário"). CTA de waitlist contextual ("sua cidade não está aqui? deixe o e-mail").

## Tela 3 — `/obrigado` (Fase 0)
Confirma entrada na waitlist + um pedido: "responde o e-mail de confirmação contando qual concurso você está esperando" (resposta qualitativa de ouro para produto, e ensina a caixa de entrada que não somos spam).

## Tela 4 — `/app` (MVP)
Resumo: status da assinatura (ativo/trial futuro/vencido), watchlists ativas, última varredura ("hoje às 06:12 ótimo estado"), contagem de alertas enviados. Sem métrica vaidosa.

## Tela 5 — `/app/watchlists` nova/edição
Campos: nome completo (como sai no diário), CPF parcial com máscara `***.XXX.XXX-**` guiada ("só precisamos dos 3 primeiros e 2 últimos"), órgão livre, 1–3 municípios com autocomplete validado contra cobertura. Badge: "coberto ✅" ou bloqueio com opção `coverage_waitlist`.

## Tela 6 — `/app/alertas`
Lista cronológica: data, município, excerpt destacado, link PDF oficial, status (novo/visto). Estado vazio importante: "Nenhum alerta ainda — e isso é uma boa notícia. Estamos lendo por você todos os dias."

## Tela 7 — `/app/assinatura`
Plano atual, próxima cobrança, botão "gerenciar" (portal Cakto se disponível; senão, e-mail de cancelamento manual com SLA de 24h — aceitável no MVP, registrar dívida).

## E-mails (templates, PT-BR — ADR-013: só e-mail no MVP)
1. **Confirmação de waitlist** (Fase 0).
2. **Boas-vindas pós-pagamento** (quando a Fase 2 reintroduzir Telegram, este e-mail passa a instruir o vínculo).
3. **Alerta de match** — assunto direto: "🔔 Seu nome apareceu no Diário Oficial de <Município> (<data>)". Corpo: excerpt, edição, link PDF, disclaimer.
4. (Fase 2) **Resumo semanal** "0 matches, tudo certo".
