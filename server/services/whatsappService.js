// WhatsApp OTP Service for Cleanz24

export async function sendWhatsAppOtp(phone, otp) {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const recipient = `91${cleanPhone}`;

  // Professional English message template
  const englishMessage = 
`*Cleanz24 Verification Code* 🧺

Your login verification code is: *${otp}*

This code is valid for 5 minutes. For your account security, please do not share this code with anyone.

— Cleanz24 Eco Laundry & Dry Clean`;

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "cleanz24_app";

  if (token && phoneId) {
    try {
      const activeTemplate = templateName || "cleanz24_app";

      // Payload for Authentication template (cleanz24_app)
      // Meta authentication templates can have body OTP parameter and optional copy-code button parameter
      let payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "template",
        template: {
          name: activeTemplate,
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: String(otp) }]
            },
            {
              type: "button",
              sub_type: "url",
              index: 0,
              parameters: [{ type: "text", text: String(otp) }]
            }
          ]
        }
      };

      const ctrl1 = new AbortController(); const t1 = setTimeout(() => ctrl1.abort(), 6000);
      let response = await fetch(`https://graph.facebook.com/v25.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: ctrl1.signal
      });
      clearTimeout(t1);
      let data = await response.json();

      // If button parameter mismatch occurs, retry template with body only
      if (data.error) {
        console.warn(`[WhatsApp API Initial Template Attempt]:`, data.error.message, "- Retrying with body only...");
        const bodyOnlyPayload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: recipient,
          type: "template",
          template: {
            name: activeTemplate,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", text: String(otp) }]
              }
            ]
          }
        };
        const ctrl2 = new AbortController(); const t2 = setTimeout(() => ctrl2.abort(), 6000);
        const retryResp = await fetch(`https://graph.facebook.com/v25.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyOnlyPayload),
          signal: ctrl2.signal
        });
        clearTimeout(t2);
        const retryData = await retryResp.json();
        if (!retryData.error) {
          data = retryData;
        }
      }

      // If template not approved yet or text fallback needed, try text message
      if (data.error && payload.type === "template") {
        console.warn(`[WhatsApp Template Status/Error]:`, data.error.message, "- Trying text message fallback...");
        const ctrl3 = new AbortController(); const t3 = setTimeout(() => ctrl3.abort(), 5000);
        let fbResponse = await fetch(`https://graph.facebook.com/v25.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient,
            type: "text",
            text: { preview_url: false, body: englishMessage }
          }),
          signal: ctrl3.signal
        });
        clearTimeout(t3);
        data = await fbResponse.json();
      }

      if (data.error) {
        console.warn(`[WhatsApp API Response Error]:`, JSON.stringify(data.error));
      } else {
        console.log(`[WhatsApp API Live Delivered] to +${recipient}:`, data);
        return { success: true, live: true, data };
      }
    } catch (err) {
      console.error("[WhatsApp API Network Error]:", err.message);
    }
  }

  // Development / Demo mode: log to server console in clean English
  console.log("\n=======================================================");
  console.log(`💬 [WHATSAPP OTP MESSAGE TO +${recipient}]`);
  console.log("-------------------------------------------------------");
  console.log(englishMessage);
  console.log("=======================================================\n");

  return { success: true, live: false, demoOtp: otp, message: "OTP sent via WhatsApp" };
}