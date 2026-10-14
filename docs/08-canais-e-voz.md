# 08 — Canais de Distribuição e Voz

> ADR-008: Reddit + grupos de WhatsApp/Telegram + indicação. Sem ads no início.
> Este doc carrega as lições duras da Dozena (r/programacao, 2026-10-13): **texto com cara de IA é zoado; autopromoção proibida remove post; conta sem histórico parece bot.**

## 1. A voz (regras não-negociáveis)
1. **Voz humana, primeira pessoa.** O Owner escreve como quem vive o problema, ou já viveu perto.
2. **Sem tricolon.** Nunca três frases paralelas ("Sem equipe. Sem tempo. Sem dinheiro.") — é a assinatura de IA mais reconhecível. Variar ritmo: frase longa, frase curta, detalhe torto.
3. **Detalhe específico > adjetivo.** "meu primo perdeu o prazo de uma nomeação em 2023 porque saiu num diário de sexta" convence; "solução inovadora" não.
4. Humildade de produto novo: "tô validando isso, quem mais já perdeu prazo de nomeação?" abre conversa; "revolucionário" fecha.
5. Toda copy pública linka `/cobertura` quando falar de cobertura. Nunca prometer Brasil inteiro.
6. IA pode **revisar gramática**; o texto-base sai do Owner.

## 2. Reddit
### Subs-alvos
| Sub | Como usar |
|---|---|
| r/concursos | Sub principal. **Ler as regras antes**; participar ajudando (threads de "perdi prazo"/"como acompanho nomeação") e mencionar o produto só quando relevante e permitido |
| r/concurseiros | Idem; comunidade ativa de pós-prova |
| r/brasil | Só se houver thread orgânica sobre concursos — nunca postar direto |
| r/desabafos / r/30mais etc. | Casos de "perdi minha nomeação" aparecem; responder com empatia primeiro |
### Regras operacionais
- **Razão 9:1** — nove contribuições genuínas para cada menção própria.
- Conta principal do Owner, com histórico real; nada de conta fresca.
- Formato que funciona: **pergunta genuína + experiência**, não press release. Ex.: "Alguém aqui já perdeu prazo de nomeação municipal? Como vocês acompanham o diário oficial da cidade? Eu tentei ler o do meu município por umas semanas e desisti…"
- Se um sub proíbe autopromoção: **não postar link**. Participar e deixar o perfil falar.

## 3. WhatsApp / Telegram (canal mais forte deste público)
- Mapear 10–20 grupos de concursos (municipais, áreas: saúde, educação, polícia, tribunais).
- Entrar como pessoa, ficar alguns dias, ajudar, e só então mencionar — e só onde regras do grupo permitirem.
- **Asset de compartilhamento:** um texto curto + a pergunta "sua cidade tá coberta? confere aqui: <link>" — o widget da landing FAZ a venda sozinho.
- Rastrear com `source=whatsapp` / utm por grupo.

## 4. Indicação
- E-mail de confirmação da waitlist já pede: "conhece alguém esperando nomeação? manda o link".
- Pós-MVP: avaliar programa de indicação (IDEIAS-FUTURAS #6).

## 5. Métricas por canal
Via `waitlist.source` + utms + `events`: waitlist confirmada por canal, e qual canal traz municípios-não-cobertos (sinal de expansão). Revisão semanal com o Owner.

## 6. O que NUNCA fazer
- Crosspost do mesmo texto em vários subs (viola regras comuns e parece bot).
- Comprar upvote/comentário. Responder crítica com ironia.
- Postar no r/concursos texto que comece com anúncio — primeiro ganhar o direito de fala na comunidade.
