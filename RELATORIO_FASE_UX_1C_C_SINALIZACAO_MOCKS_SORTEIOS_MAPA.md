# RELATORIO FASE UX 1C-C - Sinalizacao de mocks em sorteios e mapa

## 1. Resumo da fase

Esta fase adicionou sinalizacao clara para dados demonstrativos, mockados ou de fallback nas telas de sorteios e mapa, mantendo os mocks existentes e sem criar nova arquitetura global de feedback.

## 2. Arquivos alterados

- `src/services/rewards/index.js`
- `src/pages/SorteiosPage.jsx`
- `src/pages/SorteioDetalhesPage.jsx`
- `src/pages/MapPage.jsx`
- `RELATORIO_FASE_UX_1C_C_SINALIZACAO_MOCKS_SORTEIOS_MAPA.md`

## 3. Problema encontrado

A tela de sorteios consumia o backend real, mas em caso de 404 ou backend indisponivel o service retornava constantes locais com o mesmo formato dos dados reais. A UI nao recebia informacao sobre a origem dos dados e, por isso, podia exibir dados demonstrativos como se fossem reais.

A tela de mapa usava diretamente `src/mocks/collectionPoints.js`, mas nao avisava o usuario que os pontos eram demonstrativos.

## 4. O que foi corrigido

O service de rewards passou a marcar os retornos com metadado interno `__dataOrigin`, usando:

- `api` quando os dados vierem do backend;
- `fallback` quando os dados vierem das constantes locais apos falha permitida;
- suporte na UI para tambem reconhecer `mock`.

As telas de sorteios e detalhe agora exibem aviso apenas quando detectam origem `fallback` ou `mock`. A tela de mapa exibe aviso fixo, pois ainda usa mock local diretamente.

Os botoes de participacao em sorteio foram desabilitados e passaram a informar que a participacao ainda nao esta disponivel, evitando falso sucesso ou simulacao de participacao.

## 5. Como a tela de sorteios se comportava antes

Em `/sorteios`, quando `GET /sorteios` ou `GET /vouchers` falhava com 404 ou backend indisponivel, a tela podia exibir sorteios e vouchers locais sem qualquer aviso visual. O usuario podia entender que estava vendo dados reais do servidor.

O botao de participar ficava visualmente disponivel em sorteios ativos, apesar de nao haver fluxo real de participacao implementado.

## 6. Como a tela de mapa se comportava antes

Em `/mapa`, os pontos eram carregados diretamente de `src/mocks/collectionPoints.js`. A tela mostrava marcadores, filtros e detalhes sem informar que os dados eram demonstrativos.

## 7. Como as telas passam a se comportar agora

Em `/sorteios`, quando sorteios ou vouchers vierem de fallback/mock, aparece o aviso:

`Dados demonstrativos. Nao foi possivel carregar sorteios reais do servidor.`

Quando os dados vierem da API real, nenhum aviso de fallback e exibido. Se a API retornar lista vazia real, a tela permanece sem aviso de mock.

Em `/sorteios/:id`, quando o detalhe vier de fallback/mock, aparece o aviso:

`Este sorteio esta sendo exibido com dados demonstrativos.`

Em `/mapa`, aparece sempre o aviso:

`Mapa em modo demonstrativo. Os pontos exibidos podem nao representar dados reais do servidor.`

Os botoes de participacao nao simulam sucesso e ficam desabilitados com mensagem de indisponibilidade.

## 8. Como testar manualmente

1. Com o backend local ligado em `http://127.0.0.1:8080`, abrir `/sorteios`.
2. Confirmar que, se `GET /sorteios` e `GET /vouchers` retornarem 200 com dados reais, nao aparece aviso de fallback.
3. Confirmar que, se o backend retornar lista vazia real, a tela nao mostra aviso de mock.
4. Desligar o backend local.
5. Abrir `/sorteios` e confirmar que, caso aparecam dados demonstrativos, aparece o aviso de dados demonstrativos.
6. Abrir `/sorteios/:id` para um sorteio de fallback e confirmar o aviso de dados demonstrativos no detalhe.
7. Confirmar que botoes de participacao nao executam falso sucesso e informam indisponibilidade.
8. Abrir `/mapa` e confirmar o aviso de modo demonstrativo mantendo os marcadores mockados.

## 9. Riscos ou pendencias

- A integracao real do mapa ainda nao foi implementada nesta fase.
- A participacao real em sorteios ainda depende de endpoint e fluxo especificos.
- O fallback de sorteios e vouchers foi mantido por decisao de escopo.
- As mensagens novas foram mantidas sem acentos para evitar alterar a codificacao geral dos arquivos nesta fase.
- O build passou, mas manteve avisos ja esperados do Vite sobre diretivas `use client` em dependencias e tamanho de chunk.
