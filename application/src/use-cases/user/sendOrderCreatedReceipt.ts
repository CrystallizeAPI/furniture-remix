import { CrystallizeAPI } from '../crystallize/read';
import { availableLanguages } from '../LanguageAndMarket';
import { ClientInterface } from '@crystallize/js-api-client';
import mjml2html from 'mjml';
import { Mailer } from '../contracts/Mailer';

export default async (mailer: Mailer, apiClient: ClientInterface, order: any) => {
    const date = new Date(order.createdAt);
    let creationDate = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const api = CrystallizeAPI({
        apiClient: apiClient,
        language: availableLanguages[0],
    });
    const tenantConfig = await api.fetchTenantConfig(apiClient.config.tenantIdentifier);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: order.total.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    let mail = mjml2html(`<mjml>
        <mj-head>
          <mj-title>Order confirmation - FRNTR Boilerplate</mj-title>
          <mj-attributes>
            <mj-all font-family="Roboto, Helvetica, sans-serif" line-height="28px" font-size="15px" color="#0E0E0E"></mj-all>
          </mj-attributes>
          <mj-style>
            .product-img {
            max-width: 40px;
            }
            .order-summary td, .order-summary th {
            height: 100px;
            vertical-align: middle;
            text-align: center;
            border-bottom: 1px solid #ddd;
            }
            .order-summary td.item-image,
            .order-summary th.item-image {
            width: 40px;
            }
            .order-summary th {
            background-color: #E2ECE9;
            }
            @media only screen and (max-width: 600px) {
            .order-summary td.item-image,
            .order-summary th.item-image {
            display: none;
            width: 0;
            }
            .order-summary td.item-name {
            text-align: center;
            }
            }
          </mj-style>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image width="150px" align="center" src=${tenantConfig.logo?.url}></mj-image>
            </mj-column>
          </mj-section>
          <mj-section>
            <mj-column>
              <mj-text line-height="38px" font-size="28px" font-weight="bold" align="center">Order Confirmed!</mj-text>
              <mj-text align="center" font-size="20px" line-height="38px">Hey ${
                  order.customer.firstName
              }, thank you for your order.</mj-text>
              <mj-text font-size="17px" align="center" line-height="38px">We've received your order and will contact you as soon as it is shipped. You can find your order details below.</mj-text>
            </mj-column>
          </mj-section>

          <mj-section border-bottom="1px solid #0e0e0e" border-top="1px solid #0e0e0e">
            <mj-column>
              <mj-table>
                <tr align="center">
                  <th style="padding: 0 15px 0 0;">Date</th>
                  <th style="padding: 0 15px">Order</th>

                  <th style="padding: 0 0 0 15px;">Payment</th>
                </tr>
                <tr align="center">
                  <td style="padding: 0 15px 0 0;">${creationDate}</td>
                  <td style="padding: 0 15px;">#${order.id}</td>
                  <td style="padding: 0 0 0 15px; text-transform: capitalize">${order?.payment?.[0]?.provider}</td>
                </tr>
              </mj-table>
            </mj-column>
          </mj-section>

          <mj-section>
            <mj-column>
              <mj-spacer></mj-spacer>
              <!-- Shopping order summary -->
              <mj-table css-class="order-summary" width="100%">
              ${order.cart.map(
                  (item: any) => `<tr>
                  <td class="item-image"><img src=${item.imageUrl} class="product-img" /></td>
                  <td class="item-name">${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatter.format(item.price.gross)}</td>
                </tr>`,
              )}
              </mj-table>
            </mj-column>
          </mj-section>
          <mj-section padding="0">
            <mj-group>
              <mj-column>
                <!-- Blank Column -->
              </mj-column>
              <mj-column>
                <mj-text font-size="17px" align="right">Subtotal: <span style="color:black; font-weight:500;">${formatter.format(
                    order.total.net,
                )}</span></mj-text>
              </mj-column>
          </mj-section>


          <mj-section padding="0">
            <mj-column>
              <!-- Blank Column -->
            </mj-column>
            <mj-column>
              <mj-text font-size="17px" align="right">Tax: <span style="color:black; font-weight:500;">${formatter.format(
                  order.total.gross - order.total.net,
              )}</span></mj-text>
            </mj-column>
          </mj-section>
          <mj-section padding="0">
            <mj-column>
              <!-- Blank Column -->
            </mj-column>
            <mj-column>
              <mj-text align="right" font-size="20px">Total: <span style="color:black; font-weight:500;">${formatter.format(
                  order.total.gross,
              )}</span></mj-text>
            </mj-column>
          </mj-section>
          </mj-section>
          <mj-section>
            <mj-column border-top="1px solid #0e0e0e" border-bottom="1px solid #0e0e0e">
              <mj-text align="center" font-size="20px" font-weight="bold" padding="30px 0">Thank you for shopping with us!</mj-text>
            </mj-column>
          </mj-section>
          <mj-section background-color="#0e0e0e">
          	<mj-column>
            	<mj-text color="#ffffff">In you've any queries or require any assistance regarding your order, please contact us at hello@crystallize.com.</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>`).html;

    return await mailer(
        'Crystallize - Your order has been placed',
        `${order.customer.identifier}`,
        'hello@crystallize.com',
        `${mail}`,
    );
};
