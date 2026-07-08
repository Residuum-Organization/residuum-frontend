# Documentacao de Fluxos e Perfis do MVP Residuum

## Perfis do MVP

| Perfil conceitual | Responsabilidade |
| --- | --- |
| Administrador | Gerir usuarios, pontos, campanhas, aprovacoes administrativas e regras da plataforma. |
| Usuario Gerador / Morador | Cadastrar residuos, encontrar pontos, validar presenca, acompanhar estoque, extrato e recompensas. |
| Ponto de Entrega | Receber residuos e participar do fluxo operacional depois de cadastro e aprovacao. |
| Usuario Responsavel por Ponto de Entrega | Operar ou responder por um ponto especifico. |
| Empresa de Coleta / Destinador | Acompanhar agenda, pontos, coletas, validacoes e confirmacoes operacionais. |
| Empresa Apoiadora | Apoiar campanhas, premiacoes e acoes de engajamento. |

## Perfis implementados agora

| Role tecnica | Label visual recomendado | Status atual |
| --- | --- | --- |
| admin | Administrador | Implementado no front. |
| usuario | Morador / Gerador | Implementado no front. |
| morador | Morador / Gerador | Implementado como equivalente legado de usuario. |
| cooperativa | Cooperativa / Empresa de coleta | Implementado no front operacional. |
| parceiro | Cooperativa / Empresa de coleta | Implementado como equivalente operacional legado. |

## Fluxo do morador

1. Acessa o ambiente do morador.
2. Cadastra residuos separados.
3. Consulta estoque antes da entrega.
4. Escolhe ponto pelo mapa.
5. Valida presenca por GPS ou QR Code.
6. Aguarda confirmacao e pesagem operacional.
7. Acompanha extrato e recompensas.

## Fluxo da cooperativa / empresa de coleta

1. Acessa o ambiente operacional de coleta.
2. Consulta dashboard operacional.
3. Acompanha pontos, agenda e status.
4. Analisa descartes pendentes.
5. Confirma ou rejeita descartes usando o fluxo existente da API.
6. A pontuacao do morador so deve ser liberada depois da confirmacao e pesagem.

## Fluxo do admin

1. Acessa o ambiente administrativo.
2. Gerencia usuarios e filtros de perfis.
3. Acompanha pontos de coleta e solicitacoes.
4. Acessa campanhas como modulo administrativo/demonstrativo.
5. Pode acompanhar a tela de aprovacao por auditoria, sem alterar a natureza operacional do fluxo.

## Perfis ainda nao implementados

| Perfil | Situacao atual |
| --- | --- |
| Ponto de Entrega | Existe cadastro/solicitacao e administracao, mas nao existe painel logado proprio. |
| Usuario Responsavel por Ponto de Entrega | Nao existe role propria no front atual. |
| Empresa Apoiadora | Existe representacao em campanhas locais/demonstrativas, mas nao existe painel proprio nem role. |

## Telas demonstrativas

| Tela | Observacao |
| --- | --- |
| /campanhas | Combina campanhas padrao e campanhas locais; representa gestao administrativa de campanhas e empresas apoiadoras. |
| /nova-campanha | Salva campanha no localStorage; nao cria entidade real na API. |
| /campanhas/:id | Le campanha local do navegador; nao representa painel da empresa apoiadora. |
| /schedule | Usa constantes locais para agenda e capacidades; nao cria coleta real. |
| Graficos do /dashboard | Parte dos indicadores vem da API atual; series historicas e distribuicoes podem permanecer demonstrativas sem endpoint especifico. |

## Regras criticas

- Pontuacao so apos confirmacao e pesagem da cooperativa / empresa de coleta.
- Descarte exige validacao de presenca por GPS ou QR Code.
- Ponto de entrega precisa de aprovacao manual.
- Campanhas ainda sao locais/demonstrativas.
- Empresa apoiadora ainda nao tem painel proprio.
- As roles tecnicas permanecem: admin, usuario, morador, cooperativa e parceiro.
- A role parceiro deve ser tratada visualmente como equivalente operacional legado, evitando confusao com empresa apoiadora.
