# RELATORIO FASE UI 0 - Auditoria de Responsividade e Padrao Visual

## 1. Resumo da fase

Esta fase foi exclusivamente de auditoria do front-end Residuum. Nao houve alteracao de arquivos de aplicacao, regras de negocio, endpoints, services, autenticacao, pontuacao, GPS/QR ou backend.

O front-end tem varias telas funcionais, mas visualmente ainda se comporta mais como um conjunto de prototipos mobile independentes do que como um produto web responsivo unificado. A maior parte das telas principais usa moldura fixa de celular (`max-w-[390px]`, `max-w-sm`, `min-h-[760px]`, `rounded-[28px]`) mesmo em desktop. Isso preserva uma boa aparencia em alguns tamanhos de smartphone, mas desperdiça espaco no desktop e cria risco de corte/scroll ruim em celulares menores ou com teclado virtual.

A identidade visual esperada do produto pede fundo branco, azul-marinho proximo de `#1F4E79`, cinza e verde como apoio, com tom tecnologico. O codigo ja tem `--color-primary: #1F4E79`, mas tambem usa muitos azuis, verdes, roxos, indigos, gradientes, emojis e raios de borda diferentes. A padronizacao deve comecar por base visual e responsividade global antes de refinar telas especificas.

## 2. Mapa das telas analisadas

### Rotas publicas

- `/welcome` - `WelcomePage.jsx`: tela de boas-vindas mobile-first, usa `h-dvh`, `overflow-hidden`, `max-w-sm`.
- `/login` - `LoginPage.jsx` + `LoginForm.jsx`: card central com `max-w-sm`, visual mais consistente com `AuthShell`, mas desktop limitado.
- `/cadastro` - `RegisterPage.jsx` + `AuthShell`: fluxo em 2 etapas com modal de sucesso, bom reaproveitamento de componentes.
- `/recuperar-senha` - `ForgotPasswordPage.jsx`: card vertical com `h-dvh` e `overflow-hidden`; risco com teclado/altura pequena.

### Fluxo de ponto

- `/cadastro-ponto-coleta` - `RegisterPontoColetaPage.jsx`: usa `AuthShell`, formulario longo em coluna unica.
- `/empresa` - `CompanyPage.jsx`: usa `AuthShell`, grid `sm:grid-cols-2` para endereco.
- `/confirmacao` - `ConfirmationPage.jsx`: usa `AuthShell`, selecao de residuos, status e feedback de fallback local.

### Morador

- `/welcome-residuum` - `WelcomeResiduumPage.jsx`: visual proprio com gradiente e emojis; parece prototipo separado.
- `/inicio` - `ComingSoonPage.jsx`: placeholder "Em breve".
- `/perfil` - `ProfilePage.jsx`: tela app-like com `max-w-[420px]`, cards e navbar fixa.
- `/sorteios` - `SorteiosPage.jsx`: moldura app mobile `max-w-[390px]`.
- `/sorteios/:id` - `SorteioDetalhesPage.jsx`: mesma moldura, abas horizontais.
- `/meu-estoque` - `MeuEstoquePage.jsx`: app mobile `max-w-sm`, bom fluxo, desktop limitado.
- `/cadastrar-residuo` - `CadastrarResiduoPage.jsx`: app mobile com scanner/camera, cores proprias.
- `/validacao-presenca` - `ValidacaoPresencaPage.jsx`: fluxo critico com estoque, GPS, QR e transferencia; layout mobile em coluna.
- `/escanear-qr` - `EscanearQrCodePage.jsx`: card `max-w-md`, estilo diferente das outras telas morador.
- `/extrato` - `ExtratoPage.jsx`: app mobile `max-w-[390px]`, saldo grande e cards de historico.
- `/mapa` - `MapPage.jsx` + `Map.jsx`: app mobile com mapa Leaflet de altura fixa `330px`.

### Parceiro/cooperativa

- `/dashboard` - `DashboardScreenPage.jsx`: dashboard operacional em moldura mobile.
- `/schedule` - `ScheduleScreenPage.jsx`: agenda em moldura mobile, botao flutuante fixo com deslocamento manual.
- `/aprovacao` - `AprovacaoPage.jsx` + `ApprovalCard.jsx`: fluxo operacional de confirmacao/rejeicao dentro de `AdminShell`.

### Admin

- `/admin` - `AdminPage.jsx` + componentes admin: dashboard administrativo mobile.
- `/admin-pontos` - `AdminPointsPage.jsx`: usa paleta roxa/azul, muitos tamanhos fixos.
- `/usuarios` - `PageUsersPage.jsx`: lista, filtros e modais; usa `alert`/`confirm` nativos e cores de role.
- `/campanhas` - `CampanhasPage.jsx`: campanha em layout roxo/indigo, visual muito distinto.
- `/nova-campanha` - `NovaCampanhaPage.jsx`: formulario em layout de campanhas.
- `/campanhas/:id` - `CampanhaDetalhesPage.jsx`: detalhe de campanha customizada.

## 3. Problemas de responsividade mobile

- Uso recorrente de `h-dvh` + `overflow-hidden` em `/welcome` e `/recuperar-senha`, podendo cortar conteudo em celulares baixos, navegador com barra dinamica ou teclado virtual aberto.
- `Navbar.jsx` usa largura fixa `w-[360px]`; em aparelhos menores que 360px, a barra inferior pode encostar nas bordas ou cortar.
- Muitos containers usam `min-h-[760px]`; em celulares baixos cria rolagem artificial e sensacao de tela presa.
- Cards com `rounded-[28px]`, `rounded-[32px]` e sombras fortes reduzem area util em telas pequenas.
- Textos com `text-[9px]`, `text-[10px]`, `text-[11px]` aparecem em campanhas, extrato, sorteios e admin; podem ficar ilegíveis para baixo letramento digital.
- Alguns botoes de acao sao icon-only sem texto visivel; apesar de `aria-label` em parte deles, a compreensao para usuarios pouco digitais pode sofrer.
- `/schedule` tem botao flutuante com posicionamento fixo e `ml-[132px]`, podendo sobrepor conteudo em telas estreitas.
- `/admin-pontos` tem barras com largura fixa `w-[155px]`, percentuais grandes e chips; ha risco de aperto visual.
- `/campanhas/:id` usa abas com fonte `text-[10px]`; os labels podem ficar pequenos demais.
- `/validacao-presenca` e `/cadastrar-residuo` tem muitos blocos sucessivos; funcionam em mobile, mas precisam de hierarquia e feedback mais claros para evitar abandono.

## 4. Problemas de responsividade desktop

- A maioria das rotas usa moldura de celular (`max-w-sm`, `max-w-[390px]`, `max-w-[420px]`) mesmo em desktop, desperdicando espaco e deixando dashboards, listas, mapa e admin pouco produtivos.
- `App.jsx` adiciona `lg:pl-72` e sidebar fixa de apresentacao para todas as rotas; isso parece ambiente de demo/apresentacao, nao produto final.
- `Navbar.jsx` tenta compensar a sidebar com `lg:left-[calc(50%+9rem)]`, acoplando navegacao ao layout de apresentacao.
- Dashboard, agenda, mapa, admin e usuarios nao aproveitam grids desktop, tabelas responsivas ou areas laterais.
- `/dashboard` mostra cards em linhas de flex com apenas duas colunas estreitas, mesmo havendo espaco.
- `/mapa` limita o mapa a 390px de largura e 330px de altura; desktop deveria permitir mapa amplo com painel lateral de detalhes.
- `/usuarios` esta dentro de card mobile; filtros, paginacao e lista poderiam virar tabela/cartoes responsivos em desktop.
- `/login`, `/cadastro` e fluxo de ponto ficam sempre estreitos, sem usar bem colunas explicativas ou largura maxima intermediaria.

## 5. Problemas de padronizacao visual

- Varias paletas competem: azul-marinho `#1F4E79`, azul roxo `#110A88`, azul app `#11527A`, azul escuro `#1a3a4a/#1e4d6b`, roxo `#3020a0/#5644ce`, verdes diversos.
- `Button.jsx` define `primary` como `#0D2C8B`, enquanto a identidade de referencia pede `#1F4E79`.
- `--color-welcome-blue` e usado como cor principal em autenticacao, mas e `#110A88`, mais roxo que azul-marinho Residuum.
- `Card.jsx` usa `rounded-3xl shadow-lg`; varias telas usam `rounded-[24px]`, `[28px]`, `[30px]`, `[32px]`, criando estilos de card diferentes.
- Ha tres familias de navegacao inferior: `src/components/ui/Navbar.jsx`, `src/components/ui/BottomNav.jsx`, `src/components/admin/BottomNav.jsx` e `CampaignLayout.MenuInferior`.
- Campanhas usam identidade roxa/indigo bem distante da proposta Residuum tecnologica em branco/azul/cinza/verde.
- Uso de emojis em telas finais (`WelcomeResiduum`, admin stats, campanhas) passa sensacao de prototipo/mock.
- Algumas telas usam lucide, outras react-icons e outras SVG manual/emoji; falta linguagem iconografica unica.
- O fundo global alterna entre branco, `bg-slate-100/200`, `#F4F7FA`, `#F7FAF9`, `#fbfbff`, `#E9E9E9`.

## 6. Problemas de acessibilidade/usabilidade

- Botões icon-only em navs e dashboards dependem de reconhecimento visual; `aria-label` ajuda leitores de tela, mas usuario visual pode nao entender.
- `alert()` e `confirm()` em `/usuarios` quebram a experiencia visual e nao seguem padrao de modais/feedback do app.
- Mensagens de erro/sucesso existem em varias telas, mas nao ha componente padrao de `ErrorState`, `SuccessState` ou `Toast/InlineAlert`.
- Alguns textos usam contraste e tamanho baixos: cinza claro em inputs, `text-gray-400`, textos de 9-11px e labels muito condensados.
- Foco visivel e inconsistente: `Input` tem foco padronizado, mas inputs manuais em muitas telas usam estilos proprios.
- Alguns botoes nao indicam claramente estado carregando/disabled com componente comum.
- `/escanear-qr` usa verde/slate diferente do restante e nao tem navegacao inferior; pode parecer fluxo isolado.
- Para baixo letramento digital, termos como "transferir", "token QR Code", "fallback", "operacional" e textos longos podem precisar de simplificacao visual e textual.

## 7. Componentes repetidos ou inconsistentes

- `Button.jsx`: existe componente base, mas muitas telas usam `<button>` manual com estilos proprios.
- `Input.jsx`/`FormField.jsx`: existem, mas varias telas repetem inputs manuais (`ProfilePage`, `CadastrarResiduoPage`, `ValidacaoPresencaPage`, `PageUsersPage`, campanhas).
- `Card.jsx`: existe, mas muitos cards sao divs manuais com raios, bordas e sombras diferentes.
- `Badge.jsx` e `admin/StatusBadge.jsx`: badges duplicados e limitados.
- Nav inferior duplicada entre morador, admin e campanhas; `ui/BottomNav.jsx` aparenta estar obsoleto e sem links.
- Shells duplicados: `AuthShell`, `AdminShell`, `CampaignLayout` e molduras manuais app-like.
- Estados de loading, erro, vazio e sucesso sao implementados de forma local em cada tela.
- Headers de pagina sao manuais em quase todas as telas.

## 8. Cores atuais encontradas

Cores de base:

- `#1F4E79` - primario esperado e usado em admin/mapa/perfil.
- `#2EA44F` - acento definido em CSS.
- `#110A88` - `--color-welcome-blue`, usado em autenticacao.
- `#645353` - texto muted de welcome.
- `#E9E9E9` - surface de welcome.

Cores frequentes de telas:

- Azuis: `#0D2C8B`, `#11527A`, `#11527a`, `#12384C`, `#1a3a4a`, `#1e4d6b`, `#1e3a5f`, `#2B4B6F`, `#27466B`, `#255b86`.
- Verdes: `#1FA34A`, `#19c64a`, `#16b83e`, `#128633`, `#0B6B53`, `#22c55e`, `#139928`, `#079628`, `#2FA84F`.
- Roxos/indigos fora do padrao: `#3020a0`, `#5644ce`, `#6456dd`, `#241aa3`, `#0c1187`, `#2B248C`, `#7C3AED`, `#8B7AE6`.
- Neutros/surfaces: `#F4F7FA`, `#F7FAFB`, `#F7FAF9`, `#f7f9fc`, `#f0f2f8`, `#fbfbff`, `#DDE5EE`, `#EEF2F6`, `#e5e7eb`.
- Status/alerta: `#ef4444`, `#f59e0b`, `#E5B900`, `#FF3A3A`, `#F5D4A4`, `#FFF4D8`, `#FFF7D6`.

## 9. Tipografia e espacamentos atuais

- Fonte global: `Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial`.
- Tailwind nao define escala tipografica customizada; cada tela escolhe classes localmente.
- Tamanhos comuns: `text-sm`, `text-base`, `text-lg`, `text-2xl`, `text-3xl`.
- Tamanhos arbitrarios frequentes: `text-[8px]`, `[9px]`, `[10px]`, `[11px]`, `[12px]`, `[13px]`, `[14px]`, `[15px]`, `[17px]`, `[18px]`, `[19px]`, `[21px]`, `[22px]`, `[23px]`, `[24px]`, `[28px]`, `[30px]`, `[34px]`, `[36px]`.
- Espacamentos variam entre `px-3`, `px-4`, `px-5`, `px-6`, `p-3`, `p-4`, `p-5`, `p-6`, sem escala documentada por tipo de tela.
- Raios de borda variam muito: `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-[16px]`, `[20px]`, `[22px]`, `[24px]`, `[26px]`, `[28px]`, `[30px]`, `[32px]`.
- Larguras maximas predominantes: `max-w-sm`, `max-w-md`, `max-w-[390px]`, `max-w-[420px]`.

## 10. Proposta de padrao visual seguro

Padrao recomendado:

- Fundo principal: branco `#FFFFFF`.
- Fundo de pagina/surface leve: `#F6F8FA` ou `#F7FAF9`, usado com parcimonia.
- Primaria: `#1F4E79`.
- Primaria escura: `#173B5C` ou similar.
- Verde de sucesso/acento: `#2EA44F` ou `#1FA34A`.
- Cinzas: `#111827`, `#374151`, `#64748B`, `#E5E7EB`, `#F8FAFC`.
- Alerta: amber/vermelho Tailwind ou tokens equivalentes, sempre para estado.
- Evitar roxo/indigo como cor estrutural, salvo campanhas patrocinadas muito especificas e com isolamento controlado.

Layout seguro:

- Criar `PageContainer` mobile-first com `w-full`, `max-w-screen-xl` em desktop, padding responsivo e sem moldura de celular por padrao.
- Criar `AppFrame` apenas para quando a tela realmente precisar simular experiencia mobile, nao para admin/dashboard/mapa.
- Definir breakpoints: mobile ate 639px, tablet `sm/md`, desktop `lg/xl`.
- Usar grids responsivos em dashboard/admin/mapa: 1 coluna mobile, 2 colunas tablet, 3-4 colunas desktop conforme conteudo.
- Navegacao inferior apenas mobile; desktop deve ter sidebar/topbar real, sem offsets manuais por `calc`.
- Cards com raio padrao menor: `rounded-xl` ou `rounded-2xl`; evitar `rounded-[32px]` em componentes operacionais.
- Botoes com altura minima 44px, estados `hover`, `focus-visible`, `disabled`, `loading`.
- Inputs padronizados com label claro, ajuda/erro abaixo e foco visivel.
- Estados comuns: `LoadingState`, `ErrorState`, `EmptyState`, `SuccessState`, `InlineAlert`.

## 11. Ordem recomendada de implementacao

### FASE UI 1A - Base visual e responsividade global

- Padronizar tokens de cor em `index.css`/Tailwind.
- Definir container principal responsivo.
- Remover dependencia visual da sidebar de apresentacao para layout final.
- Corrigir navbar mobile fixa para `w-[calc(100%-...)]`/`max-w` seguro.
- Padronizar breakpoints, espacamentos, raios e shadows.
- Evitar `h-dvh + overflow-hidden` em fluxos com formulario.

### FASE UI 1B - Componentes reutilizaveis

- Evoluir `Button` com variantes, tamanhos, loading, focus e disabled.
- Criar `LoadingButton`.
- Criar `EmptyState`.
- Criar `ErrorState`.
- Criar `PageHeader`.
- Criar `PageContainer`.
- Criar `SectionCard`.
- Criar `StatusBadge`.
- Consolidar `Navbar/BottomNav` por perfil.

### FASE UI 1C - Telas publicas e autenticacao

- Ajustar `/welcome`, `/login`, `/cadastro`, `/recuperar-senha`.
- Manter fluxo simples e sem alterar autenticacao/services.
- Melhorar altura mobile com scroll seguro.

### FASE UI 1D - Fluxos principais do morador

- Ajustar `/perfil`, `/meu-estoque`, `/cadastrar-residuo`, `/validacao-presenca`, `/extrato`.
- Preservar regras de pontuacao, pesagem real, GPS e QR.
- Padronizar cards, feedback e botoes.

### FASE UI 1E - Ponto de coleta e confirmacao

- Ajustar `/cadastro-ponto-coleta`, `/empresa`, `/confirmacao`.
- Manter envio como solicitacao pendente; nao ativar ponto automaticamente.
- Melhorar etapas e mensagens sem criar falso sucesso.

### FASE UI 1F - Parceiro/cooperativa/admin

- Ajustar `/dashboard`, `/schedule`, `/aprovacao`, `/admin`, `/admin-pontos`, `/usuarios`, `/campanhas`, `/nova-campanha`, `/campanhas/:id`.
- Priorizar desktop real para operacao.
- Padronizar tabelas/listas, modais e feedbacks.

## 12. Riscos de quebrar funcionalidades existentes

- Alterar estrutura de formularios pode quebrar `react-hook-form`, `register`, validacoes Zod e nomes de campos.
- Trocar inputs/selects sem cuidado pode alterar payloads enviados a services.
- Mover botoes de transferencia, confirmacao ou rejeicao pode criar falso sucesso visual se os estados async nao forem preservados.
- Alterar `/validacao-presenca` pode afetar GPS, token QR e validacao de quantidade disponivel.
- Alterar `/cadastrar-residuo` pode afetar scanner/camera e cadastro de inventario.
- Alterar `/confirmacao` pode afetar salvamento de rascunho local e status da solicitacao de ponto.
- Alterar componentes de mapa pode quebrar Leaflet, marcadores ou abertura de rota externa.
- Mexer em nav/rotas pode quebrar acesso a telas em `App.jsx`.
- Padronizar cores de campanhas patrocinadas sem criterio pode remover identidade de campanha, mas a estrutura geral ainda deve parecer Residuum.

## 13. O que NAO deve ser alterado

- Nao alterar regras de negocio.
- Nao alterar endpoints.
- Nao alterar services de API.
- Nao alterar autenticacao.
- Nao alterar fluxo de pontuacao.
- Nao alterar validacao GPS/QR.
- Nao permitir falso sucesso.
- Nao ativar ponto de coleta automaticamente.
- Nao criar pontuacao antes da pesagem real da cooperativa.
- Nao mexer no backend.
- Nao substituir mocks/fallbacks por sucesso real.
- Nao remover mensagens que sinalizam API indisponivel ou dados demonstrativos.
- Nao mudar nomes de campos/payloads sem uma fase propria de testes.
- Nao transformar fluxos criticos em etapas extras desnecessarias; o produto deve manter minimo de etapas possivel.
