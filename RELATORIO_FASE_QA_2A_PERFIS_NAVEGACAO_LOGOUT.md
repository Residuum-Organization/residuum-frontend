# RELATORIO FASE QA 2A - Perfis, navegacao, logout e testabilidade

## 1. Resumo da fase

A FASE QA 2A auditou a autenticacao, as rotas atuais, os perfis reconhecidos pelo front-end e a navegacao minima do sistema Residuum. As correcoes implementadas foram limitadas a logout visivel, caminhos de retorno por perfil e redirecionamento inicial apos login para cooperativa/parceiro.

Nao foram alterados endpoints, services de API, payloads, backend, banco, regras de pontuacao, regras de aprovacao de ponto, fluxo de QR/GPS ou protecao global de rotas.

## 2. Arquivos analisados

- `src/App.jsx`
- `src/contexts/AuthContext.jsx`
- `src/services/auth/index.js`
- `src/api/token.js`
- `src/components/forms/LoginForm.jsx`
- `src/pages/LoginPage.jsx`
- `src/pages/AdminPage.jsx`
- `src/pages/AdminPointsPage.jsx`
- `src/pages/PageUsersPage.jsx`
- `src/pages/DashboardScreenPage.jsx`
- `src/pages/ScheduleScreenPage.jsx`
- `src/pages/AprovacaoPage.jsx`
- `src/pages/ProfilePage.jsx`
- `src/pages/WelcomeResiduumPage.jsx`
- `src/pages/ComingSoonPage.jsx`
- `src/pages/CampanhasPage.jsx`
- `src/pages/NovaCampanhaPage.jsx`
- `src/pages/CampanhaDetalhesPage.jsx`
- `src/components/admin/AdminShell.jsx`
- `src/components/admin/AdminHeader.jsx`
- `src/components/admin/BottomNav.jsx`
- `src/components/ui/Navbar.jsx`
- `src/components/ui/BottomNav.jsx`
- `src/components/Campanhas/CampaignLayout.jsx`

## 3. Arquivos alterados

- `src/components/admin/AdminShell.jsx`
- `src/components/admin/AdminHeader.jsx`
- `src/components/admin/BottomNav.jsx`
- `src/components/coleta-dados/OperationalHeader.jsx`
- `src/pages/DashboardScreenPage.jsx`
- `src/pages/ScheduleScreenPage.jsx`
- `src/pages/ProfilePage.jsx`
- `src/components/forms/LoginForm.jsx`
- `SEED_QA_USUARIOS_PERFIS_RESIDUUM.sql`

## 4. Matriz de perfis encontrada

| Perfil esperado | Roles identificadas no front | Evidencia | Observacao |
|---|---|---|---|
| Morador / usuario final | `usuario`; fallback para qualquer role nao tratada; possivel `morador` sugerido para fase futura | `LoginForm.jsx`, `PageUsersPage.jsx` | O front administra `usuario` e `admin`; `morador` ainda nao aparece como role real em codigo. |
| Cooperativa / parceiro operacional | `cooperativa`, `parceiro` | `LoginForm.jsx` atualizado | Antes da QA 2A nao havia redirecionamento especifico; agora vai para `/dashboard`. |
| Administrador | `admin` | `LoginForm.jsx`, `PageUsersPage.jsx` | Ja redirecionava para `/admin`; gestao de usuarios alterna apenas entre `admin` e `usuario`. |

## 5. Telas existentes por perfil

| Rota | Tela/componente | Perfil esperado | Perfil atualmente permitido | Observacao |
|---|---|---|---|---|
| `/welcome` | `WelcomePage` | Publica | Publica | Sem protecao de rota. |
| `/login` | `LoginPage` | Publica | Publica | Login chama `/login` e depois `/me`. |
| `/cadastro` | `RegisterPage` | Publica | Publica | Cadastro de morador. |
| `/recuperar-senha` | `ForgotPasswordPage` | Publica | Publica | Fluxo sem endpoint real, ja sinalizado em fase anterior. |
| `/cadastro-ponto-coleta` | `RegisterPontoColetaPage` | Publica | Publica | Cadastro de ponto/parceiro com analise manual. |
| `/empresa` | `CompanyPage` | Publica | Publica | Etapa do cadastro de ponto. |
| `/confirmacao` | `ConfirmationPage` | Publica | Publica | Confirmacao de solicitacao de ponto. |
| `/welcome-residuum` | `WelcomeResiduumPage` | Morador | Qualquer acesso direto | Sem protecao nesta fase. |
| `/inicio` | `ComingSoonPage` | Morador | Qualquer acesso direto | Hoje funciona como inicio simples do morador. |
| `/perfil` | `ProfilePage` | Morador | Qualquer acesso direto; depende de `/me` para dados | Recebeu botao visivel de sair. |
| `/meu-estoque` | `MeuEstoquePage` | Morador | Qualquer acesso direto; depende da API autenticada | Usa navbar do morador. |
| `/cadastrar-residuo` | `CadastrarResiduoPage` | Morador | Qualquer acesso direto; depende da API autenticada | Fluxo preservado. |
| `/validacao-presenca` | `ValidacaoPresencaPage` | Morador | Qualquer acesso direto; depende da API autenticada | QR/GPS preservados. |
| `/escanear-qr` | `EscanearQrCodePage` | Morador | Qualquer acesso direto | Fluxo preservado. |
| `/extrato` | `ExtratoPage` | Morador | Qualquer acesso direto; depende da API autenticada | Usa navbar do morador. |
| `/mapa` | `MapPage` | Morador | Qualquer acesso direto | Pode ser usado tambem como apoio operacional; decidir na QA 2B. |
| `/sorteios` | `SorteiosPage` | Morador | Qualquer acesso direto | Campanhas/sorteios do morador. |
| `/sorteios/:id` | `SorteioDetalhesPage` | Morador | Qualquer acesso direto | Redireciona para `/sorteios` se id nao existir. |
| `/dashboard` | `DashboardScreenPage` | Cooperativa/parceiro | Qualquer acesso direto; depende da API autenticada | Recebeu header operacional com Dashboard, Agenda e Sair. |
| `/schedule` | `ScheduleScreenPage` | Cooperativa/parceiro | Qualquer acesso direto | Recebeu header operacional; dados demonstrativos locais. |
| `/aprovacao` | `AprovacaoPage` | Cooperativa/parceiro ou admin, a definir | Listada em `adminRoutes`; qualquer acesso direto | Tela se apresenta como operacional, mas usa `AdminShell` e endpoints `/admin/descartes`. Ambiguidade mantida e documentada. |
| `/admin` | `AdminPage` | Administrador | Qualquer acesso direto | Recebe navegacao global do `AdminShell` com Painel admin e Sair. |
| `/admin-pontos` | `AdminPointsPage` | Administrador | Qualquer acesso direto | Dados locais demonstrativos. |
| `/usuarios` | `PageUsersPage` | Administrador | Qualquer acesso direto; depende da API admin | Reconhece filtros `usuario` e `admin`. |
| `/campanhas` | `CampanhasPage` | Administrador ou modulo demonstrativo | Qualquer acesso direto | Usa localStorage e campanhas demonstrativas. |
| `/nova-campanha` | `NovaCampanhaPage` | Administrador ou modulo demonstrativo | Qualquer acesso direto | Cria campanha apenas no localStorage. |
| `/campanhas/:id` | `CampanhaDetalhesPage` | Administrador ou modulo demonstrativo | Qualquer acesso direto | Le detalhes de campanha personalizada no localStorage. |
| `/campanha-heineken` | `CampanhaHeinekenPage` | Campanha demonstrativa | Qualquer acesso direto | Rota extra encontrada alem da lista solicitada. |
| `/certificado-coleta` | `Certificadodecoleta` | Morador/operacional, a definir | Qualquer acesso direto | Rota extra encontrada alem da lista solicitada. |

## 6. Problemas encontrados

- Nao existe protecao global de rotas por role; todas as rotas podem ser abertas diretamente pelo navegador.
- O login so diferenciava `admin` de todos os demais perfis, enviando cooperativa/parceiro para o fluxo de morador.
- O logout existia no `AuthContext`, mas nao estava claramente disponivel em todos os perfis.
- O botao de sair do admin estava somente no `AdminHeader`, usado em `/admin`, deixando outras telas do `AdminShell` sem saida clara.
- O painel de parceiro/cooperativa nao tinha caminho visivel para sair nem uma navegacao minima entre dashboard e agenda.
- A tela `/aprovacao` esta conceitualmente ambigua: esta em `adminRoutes`, usa `AdminShell`, mas tem texto de painel operacional.
- Campanhas estao acessiveis sem role e funcionam como modulo demonstrativo/local, nao como administracao persistida por API.
- `PageUsersPage` reconhece somente `usuario` e `admin` nos filtros/acoes, sem cooperativa/parceiro.

## 7. Correcoes feitas

- `AdminShell` recebeu uma barra superior simples com:
  - botao `Painel admin`, voltando para `/admin`;
  - botao `Sair`, usando `logout()` do `AuthContext` e redirecionando para `/login`.
- `AdminHeader` foi simplificado para evitar duplicidade de logout em `/admin`.
- `BottomNav` administrativo passou a apontar campanhas para `/campanhas`, em vez de ir direto para `/campanha-heineken`.
- Criado `OperationalHeader` para parceiro/cooperativa com:
  - `Dashboard` para `/dashboard`;
  - `Agenda` para `/schedule`;
  - `Sair` com `logout()` e redirect para `/login`.
- `DashboardScreenPage` e `ScheduleScreenPage` passaram a exibir `OperationalHeader`.
- `ProfilePage` passou a ter acoes claras de `Inicio`, `Ver estoque` e `Sair`.
- `LoginForm` passou a redirecionar:
  - `admin` para `/admin`;
  - `cooperativa` ou `parceiro` para `/dashboard`;
  - demais roles para `/welcome-residuum`.

## 8. O que ficou apenas auditado e nao implementado

- Protecao de rotas por perfil.
- Bloqueio de telas administrativas para usuario comum.
- Pagina 403/acesso negado.
- Menu dinamico por role.
- Fallback formal para usuario sem role.
- Revisao estrutural de `/aprovacao`.
- Inclusao de role `cooperativa` na gestao administrativa de usuarios.
- Integracao real de campanhas com API.
- Remocao, fusao ou renomeacao de telas de campanha.
- Ajustes de regra de negocio, QR/GPS, pontuacao, aprovacao de ponto ou ativacao automatica.

## 9. Como testar manualmente

1. Rodar `npm run build`.
2. Rodar `npm run dev`.
3. Abrir `/login`.
4. Logar como usuario comum e confirmar redirecionamento para `/welcome-residuum`.
5. Abrir `/perfil` e confirmar que existem `Inicio`, `Ver estoque` e `Sair`.
6. Clicar em `Sair` e confirmar redirect para `/login`.
7. Logar como cooperativa/parceiro e confirmar redirecionamento para `/dashboard`.
8. Em `/dashboard`, confirmar botoes `Dashboard`, `Agenda` e `Sair`.
9. Abrir `/schedule`, confirmar a mesma navegacao operacional e testar logout.
10. Logar como admin e confirmar redirecionamento para `/admin`.
11. Abrir `/admin`, `/admin-pontos`, `/usuarios`, `/campanhas`, `/nova-campanha` e `/campanhas/:id`.
12. Confirmar que todas as telas dentro do admin/campanhas possuem caminho de retorno ou navegacao inferior.
13. Em uma tela administrativa, clicar `Sair` e confirmar que a sessao e limpa e o usuario volta para `/login`.
14. Confirmar que nenhuma rota foi removida.
15. Confirmar que nenhum endpoint, service de API ou payload foi alterado.

## 10. Riscos ou pendencias para a proxima fase

- Sem `ProtectedRoute`/`RoleRoute`, usuario sem perfil correto ainda consegue abrir telas por URL direta.
- Se o backend usar role diferente de `cooperativa` ou `parceiro`, o redirecionamento ainda caira no fluxo de morador.
- `/aprovacao` precisa decisao de produto: admin, cooperativa/parceiro ou area compartilhada.
- `/campanhas`, `/nova-campanha` e `/campanhas/:id` parecem modulo demonstrativo administrativo/local e devem ser revisadas antes de virarem fluxo real.
- `PageUsersPage` ainda nao permite promover/filtrar cooperativa/parceiro.
- O SQL auxiliar depende de confirmacao do schema real do backend antes de ser executado.

## Usuarios de teste necessarios

- `admin.teste@residuum.com` - role `admin`
- `cooperativa.teste@residuum.com` - role `cooperativa`
- `morador.teste@residuum.com` - role `usuario`

Se o backend usar `morador` como role real, alinhar o front na FASE QA 2B antes de ativar protecao por perfil.

## FASE QA 2B - Matriz de acesso e protecao de rotas por perfil

Proxima fase recomendada:

- Implementar `ProtectedRoute`.
- Implementar `RoleRoute`.
- Criar redirects por perfil apos login e ao acessar `/`.
- Criar pagina 403/acesso negado.
- Definir fallback para usuario autenticado sem role.
- Definir menu por perfil.
- Resolver a classificacao final de `/aprovacao`.
- Resolver se campanhas sao admin, publicas, sorteios de morador ou modulo separado.
