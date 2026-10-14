# 01 — Problema e Personas

> Documento de produto. Sem código aqui.

## 1. A dor, com precisão
Quem passa num concurso municipal não recebe uma carta nem um e-mail. A convocação sai como **ato publicado no Diário Oficial do município**. O prazo para tomar posse (ou defender vaga) corre a partir da publicação — frequentemente dias úteis, contados da data do diário.

A pessoa deveria ler o diário oficial **todos os dias, durante 2 a 5 anos**, que é o prazo típico de validade de um concurso. Ninguém faz isso. O resultado: nomeações perdidas, eliminações, e uma fila de processos judiciais — tribunais de GO, MS, AL, AM e outros já anularam eliminações de quem perdeu convocação publicada só no diário. Ganhar na Justiça é possível; contar com isso é péssimo plano.

## 2. Por que as soluções atuais não resolvem
| Alternativa | Furo |
|---|---|
| Ler o diário todo dia | Invável; é exatamente o que ninguém faz |
| Alerta oficial do DOU (União) | Só cobre a União; a grande massa de concursos é municipal |
| Grupos de WhatsApp do concurso | Alguém precisa avistar e compartilhar; falha em município pequeno |
| Advogado depois do prazo | Caro, lento, incerto — é plano B, não solução |
| Sites de concurso (PCI, QConcursos…) | Avisam de **edital aberto**, não da **sua convocação** depois de aprovado |

O espaço vazio: **pós-aprovação, nível municipal, individualizado, barato.**

## 3. Personas
### Persona 1 — "A Aprovada da Reserva" (primária)
- 27 anos, aprovada em cadastro de reserva numa prefeitura de interior, posição 14 com 8 vagas imediatas.
- Trabalha CLT enquanto espera. Não lê o diário. Sabe, por experiência de conhecidos, que convocação "sai do nada".
- Vive no WhatsApp e no Telegram; paga tudo em PIX.
- **Gatilho de compra:** um caso conhecido de alguém que perdeu prazo. Preço abaixo de um lanche por mês = decisão sem atrito.

### Persona 2 — "O Concurseiro Profissional" (secundária)
- 31 anos, 3 aprovações acumuladas em municípios diferentes, esperando a melhor nomeação.
- Monitora **vários municípios ao mesmo tempo** (por isso a watchlist múltipla já existe no MVP, capada em 3).
- Cético com serviços novos; vai conferir a página "O que cobrimos" antes de pagar.

### Persona 3 — "O Pai/Mãe que monitora pelo filho" (surpresa, observar)
- Quem paga e monitora não é necessariamente o aprovado. Se aparecer na Fase 0, considerar copy que fale também com essa pessoa.

## 4. Jornada resumida do usuário
1. Descobre o produto (Reddit/WhatsApp/indicação) → landing → confere "O que cobrimos".
2. Fase 0: entra na waitlist. Fase 1: assina (PIX, Cakto — ADR-012).
3. Cadastra watchlist: nome como sai no diário, CPF parcial, município(s), órgão.
4. Passa dias/semanas sem notícia (isso é o sistema funcionando — comunicado no resumo semanal, Fase 2).
5. Um dia: **alerta no e-mail às 7h com o trecho da nomeação dele** (ADR-013), data e link do PDF oficial.
6. Ele toma posse, cancela a assinatura feliz, e indica para os amigos da fila. (Churn positivo — registrar no marketing.)

## 5. Linguagem do público (usar nestas palavras, não em jargão técnico)
- "nomeação", "convocação", "tomei posse", "cadastro de reserva", "fui eliminado", "perdi o prazo", "saiu no DO"
- Evitar: "matching", "full-text", "monitoramento de dados abertos" — falar "a gente lê o diário por você".
