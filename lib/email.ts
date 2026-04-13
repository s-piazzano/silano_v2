/**
 * Helper to send emails via Resend API using native fetch
 */
export async function sendOrderEmail({ 
  to, 
  subject, 
  orderData 
}: { 
  to: string, 
  subject: string, 
  orderData: {
    order_id: string;
    customer_name: string;
    customer_email: string;
    customer_type: string;
    shipping_address: {
      streetAndNumber: string;
      city: string;
      postalCode: string;
      province: string;
      country: string;
    };
    total_amount: number;
    items: any[];
  } 
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[Email Error] Missing RESEND_API_KEY');
    return;
  }

  const itemsHtml = orderData.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">
        <div style="font-weight: 600; color: #1a1a1a;">${item.title}</div>
        <div style="font-size: 12px; color: #666;">ID: ${item.id}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: center; color: #444;">${item.qty}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 500; color: #1a1a1a;">€ ${item.verified_unit_price?.toFixed(2) || '0.00'}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f6; }
        .wrapper { background-color: #f4f7f6; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #004d40; color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 40px; }
        .welcome { font-size: 18px; margin-bottom: 24px; color: #1a1a1a; }
        .section { margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #f0f0f0; }
        .section:last-child { border-bottom: none; }
        .label { font-weight: 700; color: #004d40; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block; }
        .address-box { background: #f9fbfb; padding: 16px; border-radius: 8px; border: 1px solid #e0e8e8; color: #444; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 0.5px; padding: 12px; text-align: left; background: #fafafa; }
        .total-box { background: #004d40; color: white; padding: 20px; border-radius: 8px; text-align: right; margin-top: 24px; }
        .total-label { font-size: 14px; opacity: 0.9; }
        .total-amount { font-size: 24px; font-weight: 700; display: block; margin-top: 4px; }
        .footer { padding: 32px 20px; font-size: 13px; color: #888; text-align: center; }
        .button { display: inline-block; padding: 12px 24px; background: #004d40; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Silano SRL</h1>
            <p>Conferma Ordine #${orderData.order_id}</p>
          </div>
          <div class="content">
            <p class="welcome">Gentile <strong>${orderData.customer_name}</strong>,</p>
            <p>Grazie per il tuo acquisto! Abbiamo ricevuto il tuo ordine e lo stiamo elaborando con cura.</p>
            
            <div class="section">
              <span class="label">Indirizzo di Spedizione</span>
              <div class="address-box">
                ${orderData.shipping_address.streetAndNumber}<br>
                ${orderData.shipping_address.postalCode} ${orderData.shipping_address.city} (${orderData.shipping_address.province})<br>
                ${orderData.shipping_address.country}
              </div>
            </div>

            <div class="section">
              <span class="label">Riepilogo Prodotti</span>
              <table>
                <thead>
                  <tr>
                    <th style="padding: 12px; text-align: left;">Prodotto</th>
                    <th style="padding: 12px; text-align: center;">Qtà</th>
                    <th style="padding: 12px; text-align: right;">Prezzo</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              <div class="total-box">
                <span class="total-label">Totale Pagato</span>
                <span class="total-amount">€ ${orderData.total_amount?.toFixed(2)}</span>
              </div>
            </div>

            <p style="font-size: 14px; color: #666; font-style: italic;">
              Ti invieremo un'altra email con il codice di tracciamento non appena il pacco sarà affidato al corriere (solitamente entro 24-48 ore lavorative).
            </p>
          </div>
          <div class="footer">
            <p><strong>Silano SRL</strong><br>Via Example 123, Italia</p>
            <p>&copy; ${new Date().getFullYear()} Silano SRL. Tutti i diritti riservati.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Silano SRL <ordini@silanosrl.it>',
        to: [to],
        reply_to: 'info@silanosrl.it',
        subject: subject,
        html: html
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Email Error] Failed to send email:', error);
    }
  } catch (err) {
    console.error('[Email Error] Connection failed:', err);
  }
}

/**
 * Helper to notify Admin about a new order
 */
export async function sendAdminNotification(orderData: any) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const itemsList = orderData.items.map((item: any) => 
      `<li>${item.qty}x ${item.title} (ID: ${item.id}) - €${item.verified_unit_price?.toFixed(2)}</li>`
    ).join('');

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Silano SRL <ordini@silanosrl.it>',
        to: ['info@silanosrl.it'], 
        subject: `🆕 Nuovo Ordine Ricevuto: #${orderData.order_id}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #004d40;">Notifica Nuovo Ordine</h2>
            <p>È stato ricevuto un nuovo ordine sul sito.</p>
            
            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>ID Ordine:</strong> ${orderData.order_id}</p>
              <p><strong>Cliente:</strong> ${orderData.customer_name} (${orderData.customer_email})</p>
              <p><strong>Tipo Cliente:</strong> ${orderData.customer_type}</p>
              <p><strong>Importo Totale:</strong> € ${orderData.total_amount?.toFixed(2)}</p>
            </div>

            <h3>Prodotti:</h3>
            <ul>${itemsList}</ul>

            <div style="margin-top: 30px;">
              <a href="https://pannello.silanosrl.it" style="background: #004d40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Vai al Pannello Gestione
              </a>
            </div>
          </div>
        `
      })
    });
  } catch (err) {
    console.error('[Admin Email Error]', err);
  }
}
