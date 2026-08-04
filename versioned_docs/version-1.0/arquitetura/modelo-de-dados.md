---
id: modelo-de-dados
title: Modelo de dados
sidebar_label: Modelo de dados
description: Diagrama ER das principais entidades — grupo, catálogo, clientes e pedidos.
---

# Modelo de dados

As entidades centrais e como se relacionam. Tudo pendura em **`Group`** (o tenant).

```mermaid
erDiagram
  Group ||--o{ Student : "tem"
  Group ||--o{ ApiKey : "emite"
  Group ||--o{ Product : "possui"
  Group ||--o{ Customer : "possui"
  Group ||--o{ Order : "possui"
  Group ||--|| GroupConfig : "config da loja"

  Product ||--o{ ProductVariant : "vende por"
  Product ||--o{ ProductImage : "tem"
  ProductVariant ||--o{ OrderItem : "vira"

  Customer ||--o{ Order : "faz"
  Customer ||--o{ Cart : "tem"
  Order ||--o{ OrderItem : "contém"
  Cart ||--o{ CartItem : "contém"

  Group {
    string id PK
    string name
    string apiKeyHash "chave primária (professor)"
  }
  ApiKey {
    string id PK
    string name
    string keyPrefix
    datetime revokedAt "null = ativa"
  }
  ProductVariant {
    string id PK
    string sku
    float price
    int stock
  }
  Order {
    string id PK
    string status "PENDING/PAID/..."
    float total
  }
```

## Leitura rápida

- **`Group`** é o centro: alunos, chaves, produtos, clientes e pedidos são todos _dele_.
- **`ProductVariant`** é a **unidade vendável** — carrega `sku`, `price` e `stock`, e é o
  que vira `OrderItem`.
- **`ApiKey`** guarda só o **hash**; `revokedAt = null` significa chave ativa. Convive com
  a `Group.apiKeyHash` (a chave primária criada pelo professor).
- **`GroupConfig`** guarda a configuração da loja (identidade, contato, tema, regional).

:::note Isolamento na prática
Nenhuma dessas tabelas é consultada sem o filtro de `groupId` (via `tenantScope`). É isso
que garante que um grupo nunca leia dados de outro.
:::
