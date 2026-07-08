# Relatorio FASE QA 2C - Conformidade MVP, Fluxos e Perfis

## 1. Resumo da fase

A FASE QA 2C alinhou a nomenclatura visual dos perfis do front atual com os perfis conceituais do MVP do Residuum. A implementacao manteve roles tecnicas, rotas, endpoints, services, payloads, localStorage e regras de negocio existentes. Foram feitos apenas ajustes textuais/visuais seguros e criada documentacao interna sobre fluxos, lacunas e pendencias.

## 2. Documentos/imagens de MVP considerados

| Fonte | Consideracao nesta fase |
| --- | --- |
| Contexto informado da FASE QA 2C | Base principal para os perfis conceituais do MVP e restricoes de implementacao. |
| Relatorios anteriores do projeto | Foram considerados como historico local da QA 2A, QA 2B e fases de UI/UX ja presentes na raiz do repositorio. |
| Imagens do MVP | Nenhum novo arquivo de imagem foi alterado nesta fase; os perfis conceituais vieram do contexto textual fornecido. |

## 3. Perfis conceituais do MVP

| Perfil no MVP | Responsabilidade |
| --- | --- |
| Administrador | Gerir usuarios, pontos, campanhas, regras e auditoria da plataforma. |
| Usuario Gerador / Morador | Cadastrar residuos, validar presenca, acompanhar estoque, extrato e recompensas. |
| Ponto de Entrega | Receber residuos e participar do fluxo apos cadastro e aprovacao. |
| Usuario Responsavel por Ponto de Entrega | Operar ou responder por um ponto de entrega. |
| Empresa de Coleta / Destinador | Acompanhar pontos, agenda, coletas e confirmacoes operacionais. |
| Empresa Apoiadora | Apoiar campanhas, premiacoes e acoes de engajamento. |

## 4. Perfis implementados atualmente no front

| Role tecnica | Label visual apos QA 2C | Observacao |
| --- | --- | --- |
| admin | Administrador | Ambiente administrativo. |
| usuario | Morador / Gerador | Ambiente do morador. |
| morador | Morador / Gerador | Equivalente legado de usuario. |
| cooperativa | Cooperativa / Empresa de coleta | Ambiente operacional de coleta. |
| parceiro | Cooperativa / Empresa de coleta | Equivalente operacional legado; nao deve ser confundido com empresa apoiadora. |

## 5. Diferencas encontradas

| Perfil no MVP | Responsabilidade | Existe no front hoje? | Role atual equivalente | Telas atuais relacionadas | Lacuna | Recomendacao |
| --- | --- | --- | --- | --- | --- | --- |
| Administrador | Gestao administrativa, usuarios, pontos, campanhas e auditoria. | Sim | admin | /admin, /usuarios, /admin-pontos, /campanhas, /nova-campanha, /aprovacao | Campanhas ainda demonstrativas/locais. | Manter como nucleo administrativo do MVP atual. |
| Usuario Gerador / Morador | Cadastro de residuos, validacao, estoque, extrato e recompensas. | Sim | usuario / morador | /welcome-residuum, /meu-estoque, /cadastrar-residuo, /mapa, /validacao-presenca, /extrato, /perfil | Labels antigos usavam usuario/morador de forma inconsistente. | Usar sempre Morador / Gerador no visual. |
| Empresa de Coleta / Destinador | Operacao de agenda, pontos, coletas e confirmacao. | Parcialmente | cooperativa / parceiro | /dashboard, /schedule, /aprovacao | Role parceiro podia confundir com empresa apoiadora. | Exibir como Cooperativa / Empresa de coleta e documentar parceiro como legado operacional. |
| Ponto de Entrega | Recebimento de residuos e operacao local. | Parcialmente | Sem role propria | /cadastro-ponto-coleta, /empresa, /confirmacao, /admin-pontos | Ha cadastro/solicitacao, mas nao painel logado proprio. | Criar painel proprio apenas em fase futura. |
| Usuario Responsavel por Ponto de Entrega | Responsavel operacional por um ponto. | Nao | Sem role propria | Nao ha tela dedicada | Nao existe role nem painel proprio. | Modelar permissao e relacao com ponto antes de implementar. |
| Empresa Apoiadora | Campanhas, premiacoes e acoes de engajamento. | Apenas demonstrativo | Sem role propria | /campanhas, /nova-campanha, /campanhas/:id, /campanha-heineken | Nao existe painel proprio nem API especifica nesta fase. | Manter campanhas como modulo admin/demonstrativo ate criar role e backend. |

## 6. Matriz recomendada de perfis para o MVP atual

| Grupo recomendado | Roles tecnicas aceitas | Label visual | Home | Observacao |
| --- | --- | --- | --- | --- |
| Administracao | admin | Administrador | /admin | Centraliza gestao e auditoria. |
| Morador | usuario, morador | Morador / Gerador | /welcome-residuum | Fluxo de descarte, estoque e extrato. |
| Operacao de coleta | cooperativa, parceiro | Cooperativa / Empresa de coleta | /dashboard | Parceiro permanece apenas como role tecnica legado. |

## 7. Telas por perfil

| Perfil visual | Telas atuais |
| --- | --- |
| Administrador | /admin, /usuarios, /admin-pontos, /campanhas, /nova-campanha, /campanha-heineken, /campanhas/:id, /aprovacao |
| Morador / Gerador | /welcome-residuum, /inicio, /mapa, /meu-estoque, /cadastrar-residuo, /validacao-presenca, /escanear-qr, /extrato, /sorteios, /sorteios/:id, /perfil, /certificado-coleta |
| Cooperativa / Empresa de coleta | /dashboard, /schedule, /aprovacao |
| Ponto de Entrega | /cadastro-ponto-coleta, /empresa, /confirmacao, /admin-pontos como administracao; sem painel proprio |
| Empresa Apoiadora | /campanhas, /nova-campanha e detalhes como representacao administrativa/demonstrativa; sem painel proprio |

## 8. Ajustes visuais/textuais feitos

| Arquivo | Ajuste |
| --- | --- |
| src/utils/roles.js | Labels humanos agrupados e descricoes alinhadas ao MVP atual. |
| src/components/layout/RoleEnvironmentBanner.jsx | Textos dos ambientes administrativo, morador e operacional de coleta atualizados. |
| src/pages/AcessoNegadoPage.jsx | Mensagem agora informa perfil atual, perfil necessario, retorno ao inicio do perfil e botao Sair. |
| src/pages/DashboardScreenPage.jsx | Eyebrow operacional alterado para Cooperativa / Empresa de coleta. |
| src/pages/ScheduleScreenPage.jsx | Eyebrow operacional alterado para Cooperativa / Empresa de coleta. |
| src/pages/AprovacaoPage.jsx | Texto indica area operacional compartilhada e auditoria administrativa. |
| src/pages/CampanhasPage.jsx | Texto explicita gestao administrativa de campanhas e empresas apoiadoras sem painel proprio. |
| src/pages/NovaCampanhaPage.jsx | Copy usa empresa apoiadora e reforca que nao ha role/payload/API novos. |
| src/pages/CampanhaDetalhesPage.jsx | Copy troca empresa parceira por empresa apoiadora e reforca dados locais. |
| src/pages/PageUsersPage.jsx | Filtros e badges exibem labels humanos; aviso documenta limite da acao rapida de role. |
| src/pages/WelcomeResiduumPage.jsx | Eyebrow alinhado para morador / gerador. |
| src/pages/ProfilePage.jsx | Eyebrow alinhado para morador / gerador. |

## 9. O que ficou apenas documentado

- Criacao de role propria para Empresa Apoiadora.
- Painel proprio de Empresa Apoiadora.
- Painel proprio de Ponto de Entrega.
- Role de Usuario Responsavel por Ponto de Entrega.
- Edicao completa de roles para cooperativa/parceiro na tela de usuarios.
- Integracao real de campanhas com API.
- Endpoint especifico para agenda real de coleta.

## 10. Riscos ou pendencias

| Risco ou pendencia | Impacto |
| --- | --- |
| Role tecnico parceiro ainda existe | Pode gerar confusao se reaparecer em payloads ou dados externos; visualmente foi tratado como empresa de coleta legado. |
| Campanhas continuam em localStorage | Usuarios podem interpretar como modulo real se os avisos forem removidos futuramente. |
| /aprovacao segue compartilhada entre admin e operacional | O texto foi ajustado, mas a governanca fina depende de regra futura se houver separacao de responsabilidades. |
| PageUsers alterna apenas admin/usuario | Cooperativa/parceiro aparecem em filtro/label, mas alteracao completa de role exige validacao de backend/payload. |
| Ponto de entrega sem painel proprio | O fluxo de cadastro existe, mas a experiencia logada do ponto ainda nao cobre o MVP conceitual completo. |
