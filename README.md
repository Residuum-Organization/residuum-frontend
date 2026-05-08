# Residuum (Frontend)

Frontend do Residuum — plataforma mobile-first para descarte inteligente de resíduos.

Stack principal
- React + Vite
- Tailwind CSS
- Context API + Axios
- @tanstack/react-query
- React Hook Form + Zod
- Google Maps (via @react-google-maps/api)

Quickstart

1. Instalar dependências:

```bash
npm install
```

2. Criar arquivo `.env` na raiz com as variáveis necessárias:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

3. Rodar em desenvolvimento:

```bash
npm run dev
```

Scripts

- `npm run dev` — inicia o dev server (Vite)
- `npm run build` — gera build de produção
- `npm run preview` — preview do build
- `npm run format` — formata com Prettier

CI

Um workflow GitHub Actions básico foi adicionado em `.github/workflows/ci.yml` que instala dependências e roda o build em pushes/PRs para `main`.

Issues & Roadmap

Templates de issue foram adicionados em `.github/ISSUE_TEMPLATE/` (bug_report.md, feature_request.md).

Contribuindo

- Abra uma branch por feature: `feature/<nome>`
- Siga Conventional Commits para mensagens de commit.
- Abra PRs para `main`.

Links

- Repo: https://github.com/quely78/residuum


