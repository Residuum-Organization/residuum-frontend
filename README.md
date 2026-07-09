# Residuum Frontend

Frontend da plataforma Residuum, uma aplicacao mobile-first para gestao inteligente de residuos reciclaveis. O sistema conecta moradores, pontos de coleta e cooperativas em um fluxo completo de descarte, rastreamento e gamificacao.

## Stack Tecnologico

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + Vite |
| Estilizacao | Tailwind CSS |
| Roteamento | React Router DOM v6 (protecao por roles) |
| Estado do Servidor | @tanstack/react-query |
| Requisicoes HTTP | Axios (interceptor com JWT) |
| Formularios | React Hook Form + Zod |
| Graficos | Recharts |
| Mapas | Leaflet / OpenStreetMap |
| Icones | Lucide React |

## Arquitetura

O projeto adota um modelo de **Shell Architecture** baseado em perfis de acesso:

- **Morador (usuario):** Dashboard pessoal com KPIs de impacto, mapa de pontos de coleta, inventario de residuos, sorteios e extrato de pontuacao.
- **Cooperativa/Ponto de Coleta (operacional):** Dashboard operacional com volume de residuos, aprovacao de descartes pendentes e gestao de pontuacao dos moradores.
- **Administrador (admin):** Painel centralizado com metricas agregadas em tempo real, gestao de usuarios, pontos de coleta e campanhas.

Cada perfil e envelopado por um componente de layout dedicado (`RoleShell` ou `AdminShell`) que gerencia a navegacao de forma adaptativa: sidebar fixa em desktop e navegacao inferior (BottomNav) em dispositivos moveis.

## Configuracao

1. Instalar dependencias:
```bash
npm install
```

2. Criar o arquivo `.env` na raiz do projeto:
```env
VITE_API_BASE_URL=http://localhost:8080
```
O valor deve apontar para a instancia do backend Python (`backend-residuum`).

3. Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts Disponiveis

| Comando | Descricao |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite) |
| `npm run build` | Gera o build otimizado para producao |
| `npm run preview` | Serve o build de producao localmente |
| `npm run format` | Aplica formatacao com Prettier |

## Estrutura de Diretorios

```
src/
  api/            # Cliente Axios e interceptors
  components/     # Componentes reutilizaveis (ui, layout, admin, auth, forms, dashboard, maps)
  constants/      # Configuracoes estaticas (roleNavigation)
  hooks/          # Hooks customizados
  pages/          # Paginas da aplicacao
  providers/      # Providers de contexto (Auth, QueryClient)
  services/       # Camada de servicos (chamadas REST organizadas por dominio)
  utils/          # Utilitarios e helpers
```

## Contribuicao

- Branches nomeadas por contexto: `feature/<nome>`, `fix/<nome>`, `refactor/<nome>`.
- Mensagens de commit seguindo o padrao Conventional Commits.
- Pull Requests direcionados para a branch `main`.

## Repositorio

https://github.com/quely78/residuum
