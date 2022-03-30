import Koa from 'koa';
import { CrystallizeClient } from "@crystallize/js-api-client";

export async function handleOrderConfirmationRequest(request: any, context: Koa.Context, args: any): Promise<any> {
    const order = await CrystallizeClient.orderApi(ORDER_QUERY, {
        orderId: context.params.id,
    });
    if (order?.customer?.identifier !== context.user) {
        throw {
            status: 403,
            message: "Unauthorized. That is not your order."
        }
    }
    return order;
}


const ORDER_QUERY = `query GET_ORDER($orderId: ID!) {
  orders {
    get(id: $orderId) {
      id
      createdAt
      updatedAt
      customer {
        identifier
        firstName
        middleName
        lastName
        birthDate
        addresses {
          type
          firstName
          middleName
          lastName
          street
          street2
          streetNumber
          postalCode
          city
          state
          country
          phone
          email
        }
      }
      cart {
        name
        sku
        productId
        productVariantId
        imageUrl
        quantity
        price {
          gross
          net
          discounts {
            percent
          }
        }
      }
      total {
        gross
        net
        tax {
          name
          percent
        }
      }
    }
  }
}
`;
