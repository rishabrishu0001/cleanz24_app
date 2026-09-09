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
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;

  if (token && phoneId) {
    try {
      // First attempt: Send direct English text message with OTP
      let payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: { preview_url: false, body: englishMessage }
      };

      let response = await fetch(`https://graph.facebook.com/v25.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });
      let data = await response.json();

      // If text message fails due to 24h window restriction (code 131047), fallback to template
      if (data.error && (data.error.code === 131047 || data.error.code === 100)) {
        console.warn(`[WhatsApp API Text Window Warning]:`, data.error.message, "- Trying template fallback...");
        let templatePayload;
        if (templateName === "3p_direct_integration_test_template" || templateName === "hello_world" || !templateName) {
          templatePayload = {
            messaging_product: "whatsapp",
            to: recipient,
            type: "template",
            template: { name: templateName || "3p_direct_integration_test_template", language: { code: "en_US" } }
          };
        } else {
          templatePayload = {
            messaging_product: "whatsapp",
            to: recipient,
            type: "template",
            template: {
              name: templateName,
              language: { code: "en_US" },
              components: [
                { type: "body", parameters: [{ type: "text", text: otp }] }
              ]
            }
          };
        }

        response = await fetch(`https://graph.facebook.com/v25.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(templatePayload)
        });
        data = await response.json();
      }

      if (data.error) {
        console.warn(`[WhatsApp API Response Error]:`, data.error.message);
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