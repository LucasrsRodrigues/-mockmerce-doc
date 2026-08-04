---
id: deploy
title: Deploy na nuvem
sidebar_label: Deploy (professor)
description: Subir uma instância única na nuvem (Render) para os grupos consumirem pela internet.
---

# Deploy na nuvem

:::note Para o professor
Os **grupos não sobem** o backend — eles consomem. Esta página é para quem hospeda a
instância única da turma. Os alunos só precisam da **URL base** + a **chave** deles.
:::

Suba **uma** instância e todos os grupos consomem dela (e a auditoria fica num lugar só).
O caminho mais simples é o **Render** (tem free tier e Postgres gerenciado). Railway e
Fly.io são equivalentes.

## 1. Código no Git

```bash
git init && git add . && git commit -m "Backend e-commerce da turma"
git remote add origin <seu-repo> && git push -u origin main
```

:::danger Nunca suba o `.env`
O `.gitignore` já ignora `.env` e `node_modules`. Segredos (`JWT_SECRET`, `ADMIN_TOKEN`)
vão nas variáveis de ambiente do provedor, não no repositório.
:::

## 2. Banco Postgres

No Render → **New → PostgreSQL**. Copie a **Internal Database URL**.

## 3. Web Service

**New → Web Service**, aponte para o repositório:

| Campo | Valor |
|---|---|
| Runtime | Node |
| Build Command | `npm install && npm run build && npm run prisma:deploy` |
| Start Command | `npm start` |

## 4. Variáveis de ambiente

| Variável | Valor |
|---|---|
| `DATABASE_URL` | a Internal Database URL do passo 2 |
| `JWT_SECRET` | string longa e aleatória |
| `ADMIN_TOKEN` | **seu** token secreto de admin |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `*` (ou as URLs dos apps dos grupos) |

:::tip PORT/HOST
O Render define `PORT`/`HOST` sozinho — o servidor já respeita a env `PORT`.
:::

## 5. Deploy e teste

```bash
curl https://ecommerce-turma.onrender.com/health   # { "status": "ok" }
# doc viva: https://ecommerce-turma.onrender.com/docs
```

## 6. Criar os grupos (uma vez)

O `prisma:deploy` do build já cria as tabelas. Crie os grupos pelos endpoints de admin
(`X-Admin-Token`) apontando para a URL de produção — veja
[Endpoints › Loja/Admin](../endpoints/loja-aluno).
