# RELATORIO FASE UI 1F-0 - Remocao da Sidebar de Apresentacao

## 1. Resumo da fase

Foi removida a sidebar lateral de apresentacao/demo do layout global do front-end Residuum. A alteracao foi limitada ao shell global da aplicacao e ao ajuste da navegacao inferior fixa do morador em desktop, sem alterar rotas, services, endpoints, payloads, AuthContext, backend ou regras de negocio.

## 2. Arquivos alterados

- `src/App.jsx`
- `src/components/ui/Navbar.jsx`
- `RELATORIO_FASE_UI_1F_0_REMOCAO_SIDEBAR_APRESENTACAO.md`

## 3. Problema encontrado

A sidebar "Residuum Apresentacao" era renderizada globalmente em `src/App.jsx` por meio do componente `PresentationSidebar`. Ela aparecia em desktop com menu fixo lateral, grupos de demo como Autenticacao, Morador, Parceiro e Admin, e consumia largura real da aplicacao.

Tambem havia compensacoes de layout associadas a essa sidebar:

- `lg:pl-72` no wrapper global de `App.jsx`;
- posicionamento desktop compensado no `Navbar.jsx` com `lg:left-[calc(50%+9rem)]`, `lg:w-[min(30rem,calc(100vw-20rem))]`, `lg:right-auto` e `lg:-translate-x-1/2`.

## 4. O que foi removido

- Renderizacao de `PresentationSidebar`;
- componente `PresentationSidebar`;
- array `navigationGroups`, usado apenas pela sidebar de apresentacao;
- import de `NavLink` em `src/App.jsx`, que era usado apenas pela sidebar;
- padding lateral global `lg:pl-72`;
- offsets desktop da Navbar do morador vinculados ao espaco da sidebar.

## 5. O que foi preservado

- `BrowserRouter` e configuracao de rotas existentes;
- todas as listas de rotas em `App.jsx`;
- paginas existentes;
- `AuthContext`;
- endpoints, services de API e payloads;
- `Navbar` real do morador;
- `BottomNav` real do morador;
- `AdminShell`;
- `BottomNav` admin/cooperativa;
- `PageContainer`;
- regras de negocio e fluxos internos.

## 6. Como ficou o layout global

O wrapper global agora ocupa a largura total da tela sem reservar a coluna esquerda de 18rem da antiga sidebar. Em desktop, o conteudo passa a usar a area real disponivel da viewport, respeitando os containers internos de cada pagina. A Navbar fixa do morador voltou a centralizar pela viewport, sem deslocamento artificial para compensar a sidebar removida.

Em mobile, a sidebar ja nao era exibida por causa de `hidden lg:flex`, entao a mudanca esperada e neutra para a estrutura mobile. A navegacao inferior real permanece preservada.

## 7. Como testar manualmente

1. Rodar `npm run build`.
2. Rodar `npm run dev`.
3. Abrir as rotas:
   - `/welcome`
   - `/login`
   - `/cadastro`
   - `/cadastro-ponto-coleta`
   - `/empresa`
   - `/confirmacao`
   - `/welcome-residuum`
   - `/inicio`
   - `/perfil`
   - `/meu-estoque`
   - `/cadastrar-residuo`
   - `/validacao-presenca`
   - `/escanear-qr`
   - `/extrato`
   - `/mapa`
   - `/sorteios`
   - `/dashboard`
   - `/schedule`
   - `/aprovacao`
   - `/admin`
   - `/admin-pontos`
   - `/usuarios`
   - `/campanhas`
4. Confirmar que a sidebar "Residuum Apresentacao" nao aparece.
5. Confirmar que nao existe espaco vazio artificial a esquerda.
6. Confirmar que nao ha scroll horizontal.
7. Confirmar que `/inicio`, `/dashboard`, `/mapa`, `/perfil`, `/admin`, `/usuarios` e `/campanhas` continuam acessiveis.
8. Confirmar que a experiencia mobile continua normal.

## 8. Riscos ou pendencias

- Algumas telas podem ainda ter necessidades proprias de refinamento visual, mas isso fica fora desta fase.
- A fase nao incluiu redesign de admin, campanhas, dashboard, mapa ou telas especificas.
- A fase nao incluiu protecao global de rotas, toast global, modal global ou correcao global de encoding.
- Para a FASE UI 1F-B, recomenda-se revisar individualmente os shells reais de produto, especialmente admin, campanhas, dashboard e mapa, agora sem a largura consumida pela sidebar de apresentacao.
