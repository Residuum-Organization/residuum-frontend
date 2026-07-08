# RELATORIO FASE UX 1C-A - Dashboard com API indisponivel

## 1. Resumo da fase

A fase UX 1C-A corrigiu o falso estado operacional da tela `/dashboard` quando APIs criticas do painel nao respondem. O dashboard agora diferencia falha de carregamento de resposta vazia real.

## 2. Arquivos alterados

- `src/services/collectionPointDashboard/index.js`
- `src/pages/DashboardScreenPage.jsx`

## 3. Problema encontrado

O servico `getCollectionPointDashboard` usava `catch(() => [])` nas chamadas de `/pontos-coleta` e `/descarte/pendentes`. Com isso, erros de rede, autorizacao, rota inexistente ou erro do servidor eram convertidos em listas vazias.

## 4. O que foi corrigido

Os fallbacks silenciosos foram removidos das APIs criticas. Quando uma dessas chamadas falha, o erro passa a chegar ao React Query e a tela exibe um estado claro de indisponibilidade com botao para tentar novamente.

Tambem foi adicionado o campo `hasOperationalData` no retorno do servico para permitir que a tela diferencie uma resposta 200 vazia de uma falha de API.

## 5. Como o dashboard se comportava antes

Com o backend desligado ou uma API critica falhando, o servico transformava a falha em array vazio. A tela continuava renderizando cards e graficos como se o sistema estivesse normal, incluindo o indicador "Status do Sistema: Ativo".

## 6. Como o dashboard passa a se comportar com API indisponivel

Quando `/pontos-coleta` ou `/descarte/pendentes` falha, o dashboard nao renderiza os cards operacionais nem mostra "Status do Sistema: Ativo". Em vez disso, exibe:

- "Não foi possível carregar os dados operacionais do dashboard."
- "Verifique se o servidor está disponível e tente novamente."
- Botao "Tentar novamente"

## Correção complementar - estado vazio real

Apos teste com backend ligado e usuario autenticado, foi identificado que a resposta 200 sem dados operacionais reais exibia corretamente a mensagem "Nenhum dado operacional encontrado para este ponto.", mas ainda renderizava cards e graficos do dashboard logo abaixo.

O componente `DashboardScreenPage.jsx` foi ajustado para renderizar cards operacionais e graficos somente quando `hasOperationalData` for verdadeiro. Assim, quando a API responde 200, mas nao ha dados reais para o ponto, a tela mostra apenas o estado vazio real e nao exibe:

- "Status do Sistema: Ativo";
- cards operacionais zerados;
- graficos demonstrativos como se fossem dados reais.

Com isso, o dashboard passa a separar corretamente os tres cenarios:

- erro de API: estado de indisponibilidade com botao "Tentar novamente";
- resposta 200 vazia: mensagem "Nenhum dado operacional encontrado para este ponto." sem cards ou graficos;
- resposta 200 com dados: dashboard renderizado normalmente.

## 7. Como testar manualmente

Com backend ligado:

1. Iniciar o backend local em `http://127.0.0.1:8080`.
2. Abrir `/dashboard`.
3. Confirmar que o painel carrega normalmente.
4. Se as APIs responderem 200 sem dados, confirmar que aparece a mensagem "Nenhum dado operacional encontrado para este ponto.", que a tela nao trata isso como erro e que cards/graficos operacionais nao sao renderizados.

Com backend desligado:

1. Desligar o backend local.
2. Abrir `/dashboard`.
3. Confirmar que a tela nao mostra "Status do Sistema: Ativo".
4. Confirmar que a tela nao mostra cards operacionais como se estivessem baseados em dados reais.
5. Confirmar a mensagem de API indisponivel.
6. Confirmar o botao "Tentar novamente".

Com backend religado:

1. Ligar novamente o backend local.
2. Clicar em "Tentar novamente" ou recarregar a pagina.
3. Confirmar que o dashboard volta a tentar carregar dados reais.

## 8. Riscos ou pendencias

- Os graficos ainda usam dados estaticos de demonstracao quando o painel carrega com sucesso, conforme limite desta fase.
- Esta fase nao implementa o endpoint futuro `/pontos-coleta/{ponto_id}/dashboard`.
- Esta fase nao cria arquitetura global de feedback.
- O encoding global existente em alguns textos do projeto nao foi corrigido nesta fase.
