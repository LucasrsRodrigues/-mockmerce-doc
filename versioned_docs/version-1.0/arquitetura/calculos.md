---
id: calculos
title: Cálculos do pedido (Math)
sidebar_label: Cálculos (KaTeX)
description: Fórmulas de subtotal, desconto, frete e total — renderizadas com KaTeX.
---

# Cálculos do pedido

Esta página usa **Math (KaTeX)** para deixar as regras de valor explícitas. Útil quando o
app do grupo precisa **conferir** os totais que a API retorna.

## Subtotal

O subtotal é a soma do preço de cada variante pela quantidade. Para um pedido com $n$ itens:

$$
\text{Subtotal} = \sum_{i=1}^{n} p_i \cdot q_i
$$

onde $p_i$ é o preço da variante do item $i$ e $q_i$ a quantidade.

## Desconto

Um cupom pode ser **percentual** ($d\%$) ou **valor fixo** ($D$). O desconto aplicado é:

$$
\text{Desconto} = \min\!\left( \frac{d}{100} \cdot \text{Subtotal} \;+\; D,\ \text{Subtotal} \right)
$$

O $\min$ garante que o desconto **nunca** deixa o subtotal negativo.

## Total

Somando o frete $f$ e subtraindo o desconto:

$$
\text{Total} = \text{Subtotal} - \text{Desconto} + f
$$

## Exemplo numérico

Carrinho: 2 × R\$ 79,90 e 1 × R\$ 199,90, cupom de $10\%$, frete $f = 24{,}90$.

$$
\text{Subtotal} = 2 \cdot 79{,}90 + 1 \cdot 199{,}90 = 359{,}70
$$

$$
\text{Desconto} = 0{,}10 \cdot 359{,}70 = 35{,}97
\qquad
\text{Total} = 359{,}70 - 35{,}97 + 24{,}90 = 348{,}63
$$

:::tip Confira com a API
O `GET /orders/:id` retorna o `total` já calculado. Use as fórmulas acima para **validar**
no app e detectar divergências (ex.: cupom aplicado errado).
:::

:::note Frete no sandbox
O frete vem da cotação fake `POST /sandbox/shipping/quote` (PAC, SEDEX, transportadora ou
retirada). Retirada na loja normalmente tem $f = 0$.
:::
