# Auditoria de Nomenclatura — Plataforma Residuum

**Objetivo:** eliminar ambiguidade de texto para o usuário final, em 3 perfis (Morador, Ponto de Coleta, Administrador).

---

## 0. Duas decisões estruturais (aplicadas em toda a tabela abaixo)

| Decisão | Antes (inconsistente) | Depois (padrão único) |
|---|---|---|
| Mecanismo de validação | "QR Code" (landing, "como funciona") vs "código de barra" (campanha, estoque) vs "geolocalização" (rascunho de correção) | **Código de barra** — único mecanismo real, confirmado. Usado para cadastrar o resíduo no estoque **e** para validar a entrega no ponto. |
| Nome do papel "quem recebe resíduo" | Cooperativa / Empresa de coleta / Ponto de Coleta / Estabelecimento / Lojista (5 nomes para a mesma coisa) | **Ponto de Coleta** |
| Nome do papel "quem descarta" | Morador / Gerador (aparece com barra em headers e tags) | **Morador** |

Se "Cooperativa" e "Empresa de coleta" representam categorias jurídicas *diferentes* de ponto de coleta (ex: para fins de contrato ou nota fiscal), isso deve virar um **campo separado** ("Tipo de organização"), não um sinônimo solto no texto. Confirme com o time antes de remover de vez do banco de dados — a correção acima vale para o que o usuário lê na tela.

---

## 1. Landing Page

| Local | Erro (atual) | Problema | Correção |
|---|---|---|---|
| Card "Para Moradores" | "...valide suas entregas via QR Code e acumule pontos na hora." | Mecanismo errado | "...valide suas entregas via código de barra e acumule pontos na hora." |
| Card "Para Pontos de Coleta" | "Atraia clientes e controle estoques. Use nosso painel para validar entregas de moradores rapidamente via QR Code." | Mecanismo errado (a correção de vocês trocou por "geolocalização", que também está errado — cuidado para não reintroduzir isso) | "Atraia clientes e controle estoques. Use nosso painel para validar entregas de moradores rapidamente via código de barra." |
| "Como funciona na prática" — Passo 2 | "Agrupe — Separe os resíduos e gere um código no app." | Ok, mas "gere um código" é vago | "Agrupe — Separe os resíduos e escaneie o código de barra no app." |
| "Como funciona na prática" — Passo 3 | "Entregue — O ponto lê seu QR Code e valida a pesagem." | Mecanismo errado | "Entregue — O ponto de coleta lê o código de barra e valida a pesagem." |
| "Como funciona na prática" — Passo 4 | "Fature — Os pontos caem na conta na mesma hora!" | "Fature" é ambíguo (parece cobrança financeira, não pontuação de reciclagem) | "Receba — Os pontos caem na sua conta na mesma hora." |
| Hero subtexto | "...pontos de coleta atraem público e cooperativas ganham eficiência logística." | Usa "pontos de coleta" e "cooperativas" como se fossem coisas diferentes na mesma frase | "...pontos de coleta atraem público e ganham eficiência logística." |
| Card "Para Estabelecimentos" (seção 2) | Título: "Transforme sua loja em um Ponto de Coleta e atraia mais clientes." Painel mock: "Painel do Lojista" | "Estabelecimento" e "Lojista" duplicam "Ponto de Coleta" | Título: "Transforme sua loja em um Ponto de Coleta e atraia mais clientes." Painel mock: "Painel do Ponto de Coleta" |
| FAQ | "Minha empresa quer ser um ponto de coleta. É possível?" | Ok — já usa o termo correto, manter como referência de padrão |  |

---

## 2. Tela de boas-vindas / login

| Local | Erro (atual) | Problema | Correção |
|---|---|---|---|
| Boas-vindas | "Veja pontos de coleta na sua **regiao** e participe de uma cidade mais limpa e **sustentavel**." | Faltam acentos (região, sustentável) | "Veja pontos de coleta na sua região e participe de uma cidade mais limpa e sustentável." |
| Login | Todo o restante | Sem problema | Manter |

---

## 3. Painel Admin

| Local | Erro (atual) | Problema | Correção |
|---|---|---|---|
| Filtro de perfil (Usuários) | "Todos · Morador · Empresa de coleta · Administrador" | Usa "Empresa de coleta", quebrando o padrão com o resto do site | "Todos · Morador · Ponto de Coleta · Administrador" |
| Tag no card de usuário | "Morador / Gerador" | Jargão técnico sem tradução pro usuário final; formato "X / Y" confunde | "Morador" |
| Tag no card de usuário (Uninorte) | "Cooperativa / Empresa de coleta" | Mesmo problema, dobrado | "Ponto de Coleta" |
| Badge de campanha | "Ativa" (maiúscula) vs "encerrada" (minúscula) | Inconsistência de capitalização | Padronizar minúsculo: "ativa" / "encerrada" |
| Timeline de auditoria | Tag "PONTOS DE COLETA · Solicitação #4" | Ok, já correto — usar como padrão |  |
| Dados de resíduo nas listas | "plastico", "papelao" | Faltam acentos (plástico, papelão) — provavelmente dado de teste/seed, mas se for texto fixo da UI, corrigir | "Plástico", "Papelão" |

---

## 4. Painel Ponto de Coleta (hoje "Cooperativa/Empresa de coleta")

| Local | Erro (atual) | Problema | Correção |
|---|---|---|---|
| Cabeçalho do painel | "COOPERATIVA / EMPRESA DE COLETA" | Repetido em toda tela deste perfil | "PONTO DE COLETA" |
| Item de menu lateral | "Pontos" | Colide com "Pontuação" (outro item do menu) — usuário pode confundir "localização" com "pontuação de recompensa" | "Meus Locais" ou "Locais de Coleta" |
| "Meus pontos de coleta" | Campo "Materiais aceitos, separados por vírgula" → valor "plastico" | Falta de acento no dado + placeholder não deixa claro o formato esperado | Corrigir acento no dado; no campo, exemplo de placeholder: "Ex: Plástico, Papel, Vidro" |
| "Disponibilidade dos pontos" | Texto cortado: "...Chapada, Manaus [inacessível]" | Frase incompleta/truncada na tela | Revisar renderização — texto não pode ser cortado sem indicação visual |

---

## 5. Painel Morador

| Local | Erro (atual) | Problema | Correção |
|---|---|---|---|
| Cabeçalho do painel (Perfil) | "PAINEL DO MORADOR / GERADOR" | Mesmo problema do jargão "Gerador" | "PAINEL DO MORADOR" |
| "Meu Estoque" — botão de ação no item | "Transferir →" | Não fica claro o que a ação faz (transferir para onde? enviar para validação?) | "Enviar para validação →" (ou nome equivalente ao que a ação realmente dispara) |
| Campanha ativa (descrição) | "...aguardar a confirmação **do cooperativa**." | Erro de concordância de gênero | "...aguardar a confirmação **da cooperativa**." *(ou, seguindo a decisão da seção 0: "...aguardar a confirmação do ponto de coleta.")* |
| Campanha ativa (botão) | "Participe e ganhar 10 pts" | Erro de conjugação verbal (mistura imperativo com infinitivo) | "Participe e ganhe 10 pts" |
| Mapa — card de ponto | Nome de morador ("Vinícius Gomes De Lima") aparece como resultado de busca de **ponto de coleta** | Isto não é um problema de texto — é um problema de dado/lógica: uma pessoa física está aparecendo como local público de coleta | Reportar ao time técnico como bug de dado, não de copy |

---

## Priorização sugerida

1. **Padronizar "código de barra"** em todo o site (remove ambiguidade de fluxo — afeta confiança do usuário em saber o que fazer).
2. **Padronizar "Ponto de Coleta"** como nome único do papel (afeta Admin, Landing e painel do próprio ponto — é o de maior superfície de mudança).
3. **Remover "Gerador"** de headers e tags do Morador (rápido, alto impacto de clareza).
4. Corrigir concordância verbal e acentos (baixo esforço, mas some com a percepção de "app não revisado").
5. Reportar o bug de morador aparecendo como ponto de coleta no mapa (não é copy, é dado/lógica — mas afeta confiança na busca).
