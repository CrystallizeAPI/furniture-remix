import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import vippsPipelineChanges from '~/use-cases/payments/vipps/vippsPipelineChanges';
import { getStoreFront } from '~/use-cases/storefront.server';

//If you're using Vipps and want to use the webhook to change the order pipeline stage, you will need to add the following query to the webhook settings in the app.

// query GET_ORDER_IN_PIPELINE_DETAILS($orderId: ID!) {
//   order {
//     get(id: $orderId) {
//       id
//       payment {
//         ...on CustomPayment {
//           provider
//           properties {
//             property
//             value
//           }
//         }
//       }
//       pipelines {
//         pipeline {
//           id
//           name
//         }
//         stageId
//       }
//     }
//   }
// }

export const action: ActionFunction = async ({ request }) => {
    if (request.method !== 'POST') {
        return json({ message: 'Method not allowed' }, 405);
    }
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const payload = await request.json();

    const vippsPipelines = await vippsPipelineChanges(payload.order, storefront.config);

    return json({
        message: 'Order Pipleline Stage Change Webhook received',
        payload: await request.json(),
    });
};
