---
id: checkout-sequencia
title: Sequência do checkout (PlantUML)
sidebar_label: Sequência (PlantUML)
description: Diagrama de sequência detalhado do checkout e pagamento, com reserva de estoque.
---

# Sequência do checkout

Abaixo, o mesmo fluxo de compra em **PlantUML** (renderizado pelo servidor público do
PlantUML), com o detalhe da **reserva** e **baixa** de estoque.

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam sequenceMessageAlign center
actor Cliente
participant "App do grupo" as App
participant "API da turma" as API
database "Estoque" as Stock
participant "Webhook do grupo" as Hook

Cliente -> App : escolhe variante
App -> API : POST /cart/items {variantId, qty}
API --> App : carrinho atualizado

App -> API : POST /orders/checkout
API -> Stock : reserva(qty)
Stock --> API : ok (pedido PENDING)
API --> App : pedido PENDING

App -> API : POST /orders/:id/pay {method}
alt pagamento aprovado
  API -> Stock : baixa reserva
  API --> App : pedido PAID
  API -> Hook : POST order.paid (assinado)
else pagamento recusado
  API --> App : 422 / segue PENDING
  note right of Stock : reserva NÃO é baixada
end
@enduml
```

:::info Como isto é gerado
Este hub converte blocos ` ```plantuml ` em imagem via um plugin remark próprio
(`src/remark/plantuml.mjs`), que usa o encoding hexadecimal do servidor PlantUML — sem
dependências extras. Precisa de internet no navegador para renderizar.
:::

## Por que reservar no checkout?

Reservar no `checkout` (e não só no pagamento) evita **vender o mesmo item duas vezes**
enquanto o cliente conclui o pagamento. Se o pagamento falhar ou o pedido for cancelado, a
reserva é **liberada** de volta ao estoque disponível.

:::tip Compare com o Mermaid
A [visão geral](visao-geral) e o [fluxo de compra](../guias/fluxo-de-compra) usam **Mermaid**
para o mesmo fluxo. PlantUML brilha em diagramas de sequência mais densos (alt/opt/notes).
:::
