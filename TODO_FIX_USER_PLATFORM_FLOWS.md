# TODO - Fix/User Platform Flows

## Prioridade 1

- corrigir acentuação inconsistente em toda a aplicação, começando por autenticação, morador e fluxos públicos
- remover fallback de API para `localhost` em produção e definir comportamento seguro quando `VITE_API_BASE_URL` não existir
- revisar e corrigir discrepâncias herdadas do PR 19 que afetem deploy, rotas e textos reais

## Prioridade 2

- criar layout/navbar reutilizável para admin, morador e cooperativa
- adaptar as três roles para usar o layout compartilhado sem quebrar responsividade
- adicionar ação de voltar nas telas internas em que o usuário pode se perder

## Prioridade 3

- criar tela de pontos para usuários com base na gestão de pontos/admin
- revisar o fluxo do ponto de coleta e encaixar a nova tela dentro do layout compartilhado

## Prioridade 4

- substituir a welcome pós-login do morador
- alinhar sorteios e vouchers ao padrão visual estabelecido
- ajustar navegação do morador para o novo layout compartilhado

## Prioridade 5

- auditar todas as telas com mocks no fluxo do morador
- mapear o que já pode ser substituído por API real
- validar no backend-residuum as features já disponíveis para pontos, sorteios, vouchers, extrato, perfil e inventário

## Observações iniciais

- o backend já expõe rotas reais para pontos de coleta, extrato de pontos, vouchers, inventário e fluxos de descarte/validação
- o deploy já evidenciou que algumas telas integradas ainda dependem de configuração incorreta de API em produção
- o PR 19 adicionou muitos relatórios, mas deixou pendências reais de deploy e integração que precisam ser absorvidas nesta leva
