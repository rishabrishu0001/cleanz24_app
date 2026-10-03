// SMS OTP Service for Cleanz24 via Fast2SMS & MSG91

export async function sendSmsOtp(phone, otp) {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;

  // ── 1. Fast2SMS OTP Route (No DLT required, instant delivery) ──
  if (fast2SmsKey) {
    try {
      const smsCtrl = new AbortController(); const smsTimer = setTimeout(() => smsCtrl.abort(), 6000);
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "authorization": fast2SmsKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          route: "q",
          message: `Your Cleanz24 verification code is: ${otp}. Valid for 5 minutes.`,
          numbers: cleanPhone
        }),
        signal: smsCtrl.signal
      });
      clearTimeout(smsTimer);

      const data = await response.json();
      console.log(`[Fast2SMS API Response] (${cleanPhone}):`, data);

      if (data && data.return === true) {
        console.log(`✅ [Fast2SMS Live Delivered] OTP ${otp} sent to ${cleanPhone}`);
        return { success: true, live: true, data };
      } else {
        console.warn(`[Fast2SMS Warning]:`, data.message || data);
      }
    } catch (err) {
      console.error("[Fast2SMS API Network Error]:", err.message);
    }
  }

  // ── 2. Fallback to MSG91 if configured ──
  const msg91Key = process.env.MSG91_AUTH_KEY;
  const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;
  if (msg91Key && msg91TemplateId) {
    try {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(msg91TemplateId)}&mobile=91${cleanPhone}&authkey=${msg91Key}&otp=${otp}`;
      const msg91Ctrl = new AbortController(); const msg91Timer = setTimeout(() => msg91Ctrl.abort(), 5000);
      const res = await fetch(url, { method: "POST", signal: msg91Ctrl.signal });
      clearTimeout(msg91Timer);
      const data = await res.json();
      if (data?.type === "success") {
        return { success: true, live: true, data };
      }
    } catch (err) {
      console.error("[MSG91 Error]:", err.message);
    }
  }

  // ── 3. Development / Demo Mode ──
  console.log("\n=======================================================");
  console.log(`📱 [SMS OTP TO +91 ${cleanPhone}]`);
  console.log(`Your Cleanz24 verification code is: ${otp}`);
  console.log("=======================================================\n");

  return { success: true, live: false, demoOtp: otp, message: "OTP processed" };
}
