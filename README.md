# Residuum

> Plataforma inteligente para gestão de resíduos recicláveis com foco em logística verde, rastreamento ambiental e engajamento via gamificação.

O **Residuum** é uma aplicação focada em modernizar o ciclo de descarte sustentável. O sistema cria uma ponte digital entre moradores (geradores de resíduos), pontos de coleta e cooperativas de reciclagem. Através de um fluxo transparente, garante-se rastreabilidade do resíduo e recompensa ao usuário, incentivando a economia circular sustentável.

---

## 🎯 Principais Funcionalidades

- **Mapeamento e Geofencing:** Localização de pontos de coleta integrados com mapas e validação de presença física do usuário (GPS/Raio de Tolerância) para evitar fraudes no descarte.
- **Validação Offline-first (QR Code):** Alternativa para registro de descarte sem dependência imediata de rede.
- **Sistema de Agendamento:** Gestão de calendário para reservas e janelas de atendimento logístico das cooperativas.
- **Ecossistema de Gamificação:** Conversão de material reciclável em pontos virtuais.
- **Marketplace de Recompensas:** Troca dinâmica de pontos por Vouchers, produtos em parceiros e bilhetes para Sorteios promovidos por campanhas.
- **Painel Administrativo (B2B):** Dashboards gerenciais em tempo real com métricas agregadas de impacto ambiental e moderação de perfis.

---

## 💻 Tecnologias e Ferramentas

O desenvolvimento da interface segue os padrões modernos do ecossistema React, privilegiando performance e manutenibilidade.

**Core & Interface:**
- React 18 + Vite
- Tailwind CSS (Estilização utilitária e Design System interno)
- Lucide React (Ícones vetoriais)
- Recharts (Visualização de dados)
- Leaflet / OpenStreetMap (Mapas open-source)

**Gerenciamento de Estado & Comunicação HTTP:**
- TanStack Query (React Query)
- Axios (Interceptor de autenticação com JWT)

**Arquitetura de Dados no Client:**
- React Hook Form
- Zod (Validação de schemas)

**Infraestrutura:**
- pnpm (Gerenciador de pacotes otimizado)
- Docker & Docker Compose (Containerização para desenvolvimento isolado)

---

## 🏗️ Arquitetura

A fundação do projeto implementa um padrão de **Role-Based Shell Architecture**, permitindo que o layout se adapte drasticamente de acordo com a permissão (Role) do usuário autenticado.

1. **User Shell (Morador):** Experiência mobile-first focada em conversão. Menu inferior (BottomNav), fluxos guiados de descarte e visualização clara de saldos e resgates.
2. **Operational Shell (Cooperativa/Ponto):** Experiência híbrida focada em volumetria e validação. Listagem de chamados, fluxo de aprovação de descarte, pesagem e gestão de capacidade física.
3. **Admin Shell (Administrador):** Experiência desktop-first focada em relatórios. Visualização global, moderação de cooperativas (KYC), criação de Campanhas, Sorteios e auditoria (Audit Logs).

---

## 🚀 Como Executar o Projeto

Para executar o Residuum, você precisará ter o [Docker](https://docs.docker.com/get-docker/) instalado ou o ambiente Node.js com [pnpm](https://pnpm.io/).

### Ambientes via Docker (Recomendado)

A infraestrutura local com Docker abstrai a necessidade de instalar ferramentas de Node localmente e configura o mapeamento de volumes para que o *Hot-Reload* do Vite funcione de forma transparente no container.

```bash
# Inicia a aplicação expondo a porta 5173
docker compose up -d --build

# Para visualizar os logs de execução
docker compose logs -f
```

Acesse a aplicação em `http://localhost:5173`.

### Ambientes Manuais (Bare-metal)

1. Clone o repositório e instale as dependências rigorosamente através do `pnpm` (que respeitará o `pnpm-lock.yaml`):
```bash
pnpm install
```

2. Crie ou copie o arquivo `.env` referenciando a URL da API backend:
```env
VITE_API_URL=http://localhost:8080
```

3. Inicie o servidor em modo watch:
```bash
pnpm run dev
```

---

## 📦 Estrutura de Diretórios

O projeto utiliza um design modular agrupado por responsabilidades técnicas e domínios.

```text
src/
├── api/          # Configuração base do Axios e interceptors de Refresh Token
├── components/   # Componentes puramente de interface (ui) ou de domínios (admin, forms)
├── constants/    # Definições estáticas, paletas, dicionários e metadados de navegação
├── hooks/        # Lógica de interface abstraída (useAuth, usePermissions)
├── pages/        # Views principais injetadas no Router
├── providers/    # Injeção de dependências globais (Contextos do React)
├── services/     # Funções de acesso às chamadas da REST API 
└── utils/        # Funções de formatação e utilitários puros
```

---

## 🤝 Contribuição

Para garantir a estabilidade do repositório principal, por favor siga nosso guia de versionamento:

- **Commits:** Siga os padrões do [Conventional Commits](https://www.conventionalcommits.org/). Exemplos: `feat(ui): ...`, `fix(api): ...`.
- **Branches:** Utilize o prefixo correspondente, ex: `feature/adiciona-mapa`, `bugfix/corrige-token`.
- As integrações com a `main` ocorrem estritamente via **Pull Request (PR)** com revisão por pares.
