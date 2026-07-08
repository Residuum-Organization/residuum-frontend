# RELATORIO FASE QA 2B - Fluxo por perfis, protecao de rotas e usuarios de teste

## 1. Resumo da fase

A FASE QA 2B organizou o front-end Residuum por perfil operacional, adicionou protecao real de rotas por role, criou pagina de acesso negado, centralizou o destino por role e adicionou identificacao visual de ambiente para morador, cooperativa/parceiro e administrador.

Nao foram alterados endpoints, services de API, payloads, backend, regras de negocio, pontuacao, QR/GPS, localStorage de campanhas ou simulacoes de sucesso operacional.

## 2. Arquivos analisados

- `src/App.jsx`
- `src/contexts/AuthContext.jsx`
- `src/components/forms/LoginForm.jsx`
- `src/components/admin/AdminShell.jsx`
- `src/components/admin/AdminHeader.jsx`
- `src/components/admin/BottomNav.jsx`
- `src/components/coleta-dados/OperationalHeader.jsx`
- `src/components/ui/Navbar.jsx`
- `src/components/ui/BottomNav.jsx`
- `src/components/Campanhas/CampaignLayout.jsx`
- `src/pages/LoginPage.jsx`
- `src/pages/ProfilePage.jsx`
- `src/pages/AdminPage.jsx`
- `src/pages/AdminPointsPage.jsx`
- `src/pages/PageUsersPage.jsx`
- `src/pages/DashboardScreenPage.jsx`
- `src/pages/ScheduleScreenPage.jsx`
- `src/pages/AprovacaoPage.jsx`
- `src/pages/CampanhasPage.jsx`
- `src/pages/NovaCampanhaPage.jsx`
- `src/pages/CampanhaDetalhesPage.jsx`
- `src/services/auth/index.js`
- `src/services/discards/index.js`
- `SEED_QA_USUARIOS_PERFIS_RESIDUUM.sql`

## 3. Arquivos alterados/criados

Alterados:

- `src/App.jsx`
- `src/components/forms/LoginForm.jsx`
- `src/components/admin/AdminShell.jsx`
- `src/components/coleta-dados/OperationalHeader.jsx`
- `src/components/Campanhas/CampaignLayout.jsx`
- `src/pages/AprovacaoPage.jsx`
- `src/pages/ProfilePage.jsx`
- `src/pages/WelcomeResiduumPage.jsx`

Criados:

- `src/utils/roles.js`
- `src/components/auth/ProtectedRoute.jsx`
- `src/components/auth/RoleRoute.jsx`
- `src/components/layout/RoleEnvironmentBanner.jsx`
- `src/pages/AcessoNegadoPage.jsx`
- `SEED_QA_2B_USUARIOS_E_DADOS_TESTE.sql`
- `SEED_QA_2B_DADOS_COOPERATIVA.sql`
- `RELATORIO_FASE_QA_2B_FLUXO_PERFIS_PROTECAO_ROTAS.md`

## 4. Matriz final de perfis e rotas

| Rota | Componente | Perfil permitido | Se nao autenticado | Se autenticado sem permissao |
|---|---|---|---|---|
| `/welcome` | `WelcomePage` | Publico | Acessa | Acessa |
| `/login` | `LoginPage` | Publico | Acessa | Acessa |
| `/cadastro` | `RegisterPage` | Publico | Acessa | Acessa |
| `/recuperar-senha` | `ForgotPasswordPage` | Publico | Acessa | Acessa |
| `/cadastro-ponto-coleta` | `RegisterPontoColetaPage` | Publico | Acessa | Acessa |
| `/empresa` | `CompanyPage` | Publico | Acessa | Acessa |
| `/confirmacao` | `ConfirmationPage` | Publico | Acessa | Acessa |
| `/welcome-residuum` | `WelcomeResiduumPage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/inicio` | `ComingSoonPage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/perfil` | `ProfilePage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/meu-estoque` | `MeuEstoquePage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/cadastrar-residuo` | `CadastrarResiduoPage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/validacao-presenca` | `ValidacaoPresencaPage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/escanear-qr` | `EscanearQrCodePage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/extrato` | `ExtratoPage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/mapa` | `MapPage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/sorteios` | `SorteiosPage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/sorteios/:id` | `SorteioDetalhesPage` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/certificado-coleta` | `Certificadodecoleta` | `usuario`, `morador` | `/login` | `/acesso-negado` |
| `/dashboard` | `DashboardScreenPage` | `cooperativa`, `parceiro` | `/login` | `/acesso-negado` |
| `/schedule` | `ScheduleScreenPage` | `cooperativa`, `parceiro` | `/login` | `/acesso-negado` |
| `/aprovacao` | `AprovacaoPage` | `cooperativa`, `parceiro`, `admin` | `/login` | `/acesso-negado` |
| `/admin` | `AdminPage` | `admin` | `/login` | `/acesso-negado` |
| `/admin-pontos` | `AdminPointsPage` | `admin` | `/login` | `/acesso-negado` |
| `/usuarios` | `PageUsersPage` | `admin` | `/login` | `/acesso-negado` |
| `/campanhas` | `CampanhasPage` | `admin` | `/login` | `/acesso-negado` |
| `/nova-campanha` | `NovaCampanhaPage` | `admin` | `/login` | `/acesso-negado` |
| `/campanhas/:id` | `CampanhaDetalhesPage` | `admin` | `/login` | `/acesso-negado` |
| `/campanha-heineken` | `CampanhaHeinekenPage` | `admin` | `/login` | `/acesso-negado` |
| `/acesso-negado` | `AcessoNegadoPage` | Autenticado | `/login` | Acessa |

## 5. Fluxo correto definido para morador

Roles `usuario` e `morador` entram em `/welcome-residuum`. O fluxo permitido inclui inicio, perfil, estoque, cadastro de residuo, validacao por GPS/QR, extrato, mapa e sorteios. Tentativas de abrir `/admin`, `/dashboard`, `/schedule`, `/usuarios` ou campanhas administrativas caem em `/acesso-negado`.

## 6. Fluxo correto definido para cooperativa/parceiro

Roles `cooperativa` e `parceiro` entram em `/dashboard`. O fluxo permitido inclui dashboard operacional, agenda e aprovacao/coletas. Tentativas de abrir telas de morador ou administracao geral caem em `/acesso-negado`.

## 7. Fluxo correto definido para administrador

Role `admin` entra em `/admin`. O fluxo permitido inclui painel admin, pontos, usuarios, campanhas, nova campanha, detalhes de campanha e `/aprovacao`. A aprovacao foi mantida acessivel ao admin porque a tela atual usa `AdminShell` e a rejeicao chama endpoint administrativo existente; a decisao foi documentada sem alterar endpoint ou payload.

## 8. O que foi implementado em protecao de rotas

- `ProtectedRoute` bloqueia usuario nao autenticado e redireciona para `/login`.
- `RoleRoute` bloqueia usuario nao autenticado e usuario autenticado sem role permitida.
- A rota negada recebe `state.allowedRoles` e mostra o ambiente necessario quando possivel.
- `src/utils/roles.js` centraliza `getRoleHome`, `getRoleLabel`, `getRoleDescription` e `canAccessRole`.
- Login passou a usar `getRoleHome(role)`.
- Role desconhecida tem fallback inicial para `/welcome-residuum`, mas a propria `RoleRoute` bloqueia se a role nao for `usuario` ou `morador`.

## 9. Como ficou a identificacao visual de cada ambiente

- Admin: `AdminShell` mostra "Ambiente administrativo", perfil atual, texto de gestao, botao `Painel admin` e `Sair`.
- Cooperativa/parceiro: `OperationalHeader` mostra "Ambiente operacional", perfil atual, botoes `Dashboard`, `Agenda` e `Sair`.
- Morador: `WelcomeResiduumPage` e `ProfilePage` mostram "Ambiente do morador", perfil atual, botao `Inicio` e `Sair`.
- Campanhas: `CampaignLayout` agora usa o banner administrativo e menu inferior coerente com admin, sem atalho para `/mapa`.

## 10. Usuarios de teste criados/documentados

Usuarios previstos para QA local:

- `admin.teste@residuum.com` - role `admin`
- `cooperativa.teste@residuum.com` - role `cooperativa`
- `morador.teste@residuum.com` - role `usuario`

O script tenta clonar a senha/hash de `usuario.teste.atualizado@residuum.com` quando a coluna de senha for identificada. Se isso nao for possivel, ele apenas ajusta role de usuarios ja criados pelo cadastro real.

## 11. Arquivos SQL criados

- `SEED_QA_2B_USUARIOS_E_DADOS_TESTE.sql`: usa tabela `usuario`, tenta detectar coluna de senha/hash e criar/atualizar os tres usuarios de QA.
- `SEED_QA_2B_DADOS_COOPERATIVA.sql`: nao insere dados porque o schema operacional nao esta no frontend; deixa consultas e criterios seguros para criar dados quando o backend/schema estiver disponivel.

Exemplo Docker, ajustar container e credenciais reais:

```bash
docker exec -i residuum-postgres psql -U postgres -d residuum < SEED_QA_2B_USUARIOS_E_DADOS_TESTE.sql
docker exec -i residuum-postgres psql -U postgres -d residuum < SEED_QA_2B_DADOS_COOPERATIVA.sql
```

## 12. Como testar manualmente

1. Rodar `npm run build`.
2. Rodar `npm run dev` e abrir `http://127.0.0.1:5173`.
3. Executar o SQL de usuarios em ambiente local/QA, se o banco estiver disponivel.
4. Logar como `morador.teste@residuum.com`; confirmar redirect para `/welcome-residuum`; abrir `/inicio`, `/perfil`, `/meu-estoque`, `/cadastrar-residuo`, `/mapa`; tentar `/admin` e `/dashboard`.
5. Logar como `cooperativa.teste@residuum.com`; confirmar redirect para `/dashboard`; abrir `/dashboard`, `/schedule`, `/aprovacao`; tentar `/admin` e `/meu-estoque`.
6. Logar como `admin.teste@residuum.com`; confirmar redirect para `/admin`; abrir `/admin`, `/admin-pontos`, `/usuarios`, `/campanhas`, `/nova-campanha`, `/aprovacao`; tentar `/meu-estoque`.
7. Em cada perfil, clicar `Sair`, confirmar volta para `/login` e tentar abrir rota protegida sem sessao.

## 13. Riscos ou pendencias

- A validacao manual completa depende de backend, banco e credenciais locais.
- O schema de banco nao esta no repositorio frontend; por isso os dados de cooperativa nao foram inventados.
- Se o backend usar nomes de role diferentes, sera necessario ajustar `src/utils/roles.js`.
- `/aprovacao` continua conceitualmente compartilhada e deve ser revisada quando houver separacao real entre endpoints operacionais e administrativos.
- `PageUsersPage` ainda alterna papel principalmente entre `admin` e `usuario`; gestao completa de `cooperativa`/`parceiro` fica para fase futura.
- O build passou, mas manteve avisos de bundle grande e diretivas `use client` ignoradas por dependencias.
