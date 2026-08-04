---
id: conceitos
title: As 3 camadas de identidade
sidebar_label: Conceitos
description: X-API-Key, X-Student-RM e o token do cliente — quando e por que usar cada um.
---

# As 3 camadas de identidade

O que torna este projeto parecido com uma **integração real** são as três "chaves", cada
uma com um papel diferente. Entender isso resolve 90% das dúvidas de autenticação.

```mermaid
flowchart LR
  subgraph Toda chamada
    K[X-API-Key\ngrupo/tenant]
    R[X-Student-RM\nquem fez]
  end
  subgraph Só quando há cliente logado
    T[Authorization: Bearer\ntoken do cliente]
  end
  K --> API[(API da turma)]
  R --> API
  T --> API
```

## 1. `X-API-Key` — o grupo (tenant)

Identifica **qual grupo** está chamando e **isola os dados**. É **obrigatória** em quase
toda rota de negócio.

```http
X-API-Key: sk_live_xxxxxxxxxxxxxxxx
```

:::warning Nunca commitem a chave
A chave dá acesso total à loja do grupo. Guardem em **variável de ambiente** do app e
**não** subam para repositório público. Se vazar, gerem outra no painel (a antiga é revogada).
:::

## 2. `X-Student-RM` — quem fez a chamada

Diz **qual aluno** do grupo está codando/testando. É como o professor vê a participação
de cada um.

```http
X-Student-RM: RM550001
```

:::tip Conta na avaliação
Coloque o RM de quem está mexendo. Cada chamada vira uma linha de log com grupo + RM +
rota + status + latência. Participação distribuída = todos aparecem.
:::

## 3. `Authorization: Bearer` — o cliente final

Quando o **comprador** da loja de vocês faz login, ele recebe um **token JWT**. As chamadas
"do cliente" (carrinho, checkout, pedidos dele) levam esse token.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

:::info Dica de arquitetura
No painel do aluno (admin web), o **token do aluno** também vale no lugar da `X-API-Key`.
Ou seja: o app mobile de vocês usa `X-API-Key`; o painel de gestão usa o token de login do aluno.
:::

## Resumo de bolso

| Header | Obrigatório? | Quem envia |
|---|---|---|
| `X-API-Key` | Sim (rotas de negócio) | App/loja do grupo |
| `X-Student-RM` | Recomendado | App/loja do grupo |
| `Authorization: Bearer` | Só em ações do cliente logado | Após `POST /auth/login` |
