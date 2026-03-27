const Certificate = require("../models/Certificate");
const { sendEmail } = require("../config/mailer");

/** Match app “expiring soon” (30 days). Override with CERTIFICATE_EXPIRY_REMINDER_DAYS in .env */
const REMINDER_DAYS = Math.max(
  1,
  parseInt(process.env.CERTIFICATE_EXPIRY_REMINDER_DAYS || "30", 10) || 30
);

function isExpiringSoonWindow(expiryDate) {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= REMINDER_DAYS;
}

/**
 * Send one expiry email if the certificate is in the “expiring soon” window and not yet notified.
 * Sets notified=true only after a successful send.
 */
async function sendExpiryReminderIfNeeded(certificateId) {
  const cert = await Certificate.findById(certificateId).populate("userId", "email fullName");
  if (!cert || cert.notified || !isExpiringSoonWindow(cert.expiryDate)) return;

  const user = cert.userId;
  if (!user || !user.email) return;

  const subject = "Certificate Expiry Reminder";
  const message = `Dear ${user.fullName},\n\nYour certificate "${cert.certificateName}" will expire on ${cert.expiryDate.toDateString()}. Please renew it to avoid any issues.\n\nBest regards,\nPublic Service Access Tracker`;

  try {
    await sendEmail(user.email, subject, message);
    await Certificate.findByIdAndUpdate(cert._id, { notified: true });
    console.log(`Expiry reminder sent for certificate ${cert._id}`);
  } catch (err) {
    console.error("Expiry reminder email failed:", err);
  }
}

/** Daily job: same window as UI, one email per certificate (notified guard) */
async function runScheduledExpiryChecks() {
  try {
    const from = new Date();
    const until = new Date();
    until.setDate(until.getDate() + REMINDER_DAYS);

    const list = await Certificate.find({
      expiryDate: { $gte: from, $lte: until },
      notified: false,
    }).populate("userId", "email fullName");

    for (const cert of list) {
      await sendExpiryReminderIfNeeded(cert._id);
    }
    if (list.length > 0) {
      console.log(`Expiry reminder job checked ${list.length} certificate(s)`);
    }
  } catch (err) {
    console.error("Expiry reminder job error:", err);
  }
}

module.exports = {
  REMINDER_DAYS,
  isExpiringSoonWindow,
  sendExpiryReminderIfNeeded,
  runScheduledExpiryChecks,
};
