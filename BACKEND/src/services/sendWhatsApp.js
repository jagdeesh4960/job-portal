import twilio from "twilio";

const accountSid = process.env.ACCOUNT_SID ;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendWhatsAppMessage = async (toPhone, candidateName, jobTitle) => {
  try {
    const message = await client.messages.create({
      body: `👋 Hello ${candidateName}, you have been selected for the "${jobTitle}" job. Congratulations! 🎉`,
      from: "whatsapp:+14155238886", 
      to: `whatsapp:${toPhone}`, 
    });

    console.log("✅ WhatsApp message sent:", message.sid);
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error);
  } 
};
