---
id: visao-geral
title: Visão geral da arquitetura
sidebar_label: Visão geral
description: Camadas do backend multi-tenant, isolamento por grupo e rastreio por RM.
---

# Visão geral da arquitetura

Um servidor **Fastify + Prisma + PostgreSQL** hospeda todas as lojas. O isolamento é
**explícito** (todo `where` de negócio filtra pelo `groupId`), não pela topologia do banco.

```mermaid
flowchart TB
  subgraph Clientes
    Mobile[App mobile do grupo]
    Painel[Painel do aluno]
    Loja[Loja / comprador]
  end

  subgraph Backend[Backend da turma]
    direction TB
    Auth[[Camada de auth\nX-API-Key / token aluno / token cliente]]
    Rotas[Rotas de negócio\nCatálogo · Carrinho · Pedidos · Estoque]
    Tenant{{tenantScope\nfiltra por groupId}}
    Log[(RequestLog\ngrupo · RM · rota)]
    Outbox[Outbox → Webhooks]
  end

  DB[(PostgreSQL)]

  Mobile -->|X-API-Key| Auth
  Painel -->|Bearer aluno| Auth
  Loja -->|Bearer cliente| Auth
  Auth --> Rotas --> Tenant --> DB
  Rotas --> Log
  Rotas --> Outbox -->|POST assinado| Mobile
```

## Princípios

- **Multi-tenant por grupo.** Cada grupo é um _tenant_; os dados nunca vazam entre grupos.
- **Rastreio por RM.** Toda requisição vira uma linha em `RequestLog` (grupo, RM, rota,
  status, latência) — a base da avaliação de participação.
- **Eventos via Outbox.** Mudanças relevantes viram eventos entregues aos webhooks dos
  grupos (at-least-once, com assinatura HMAC).

:::info Onde isso vive no código
`src/plugins/auth.ts` (as 3 camadas), `src/lib/tenantScope.ts` (isolamento) e os módulos
em `src/modules/*` (catálogo, pedidos, webhooks…).
:::

## Camadas de identidade (resumo)

```mermaid
flowchart LR
  A[Requisição] --> B{Tem X-API-Key?}
  B -->|Sim| C[Grupo pela chave nomeada\nou chave primária]
  B -->|Não| D{Tem Bearer de aluno?}
  D -->|Sim| E[Grupo pelo token do aluno]
  D -->|Não| F[401 Unauthorized]
  C --> G[authVia = apiKey]
  E --> H[authVia = student\nvê rascunhos no painel]
```
