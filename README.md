# Hub de Docs — Loja FIAP

Documentação/tutorial da turma (2TDSPG), feita com **Docusaurus 3**. Segue o mesmo design
system do painel do aluno (verde `#22c55e`, dark mode).

## Rodar

```bash
npm install
npm start -- --port 3100      # dev server em http://localhost:3100
npm run build                 # build estático em ./build
npm run serve                 # servir o build localmente
```

> As portas 3000/3001 podem estar ocupadas por outros apps — use `--port 3100`.

## Recursos ativados

| Recurso | Onde |
|---|---|
| Busca local (offline) | `@easyops-cn/docusaurus-search-local` |
| Mermaid | ```` ```mermaid ```` (theme-mermaid) |
| PlantUML | ```` ```plantuml ```` (plugin próprio em `src/remark/plantuml.mjs`) |
| Tabs / Admonitions / MDX | nativos + componente `src/components/Endpoint` |
| Math (KaTeX) | `remark-math` + `rehype-katex` (CSS local em `static/katex`) |
| Referência OpenAPI | `docusaurus-plugin-openapi-docs` + `docusaurus-theme-openapi-docs` |
| Versionamento | `versioned_docs/` (versão `1.0` + `Next`) |
| Breadcrumbs | nativo (sidebar) |

## Atualizar a referência de API (OpenAPI)

O spec vem do backend (`/docs/json`). Para atualizar depois de mudar a API:

```bash
# 1. baixe o spec novo (backend precisa estar no ar)
curl http://localhost:3333/docs/json -o openapi/ecommerce.json

# 2. regenere as páginas
npm run docusaurus clean-api-docs ecommerce
npm run docusaurus gen-api-docs ecommerce
```

As páginas geradas ficam em `docs/api/` (não editar à mão).

## Publicar uma nova versão da doc

```bash
npm run docusaurus docs:version 1.1
```

Isso congela o conteúdo atual como `1.1`; o conteúdo em `docs/` vira a versão **Next**.
# -mockmerce-doc
