import nodemailer from 'nodemailer';

const user = process.env.GMAIL_USER || 'rekalaca@gmail.com';
const pass = (process.env.GMAIL_APP_PASSWORD || 'itbd rcqb ohpo gnsz').replace(/\s+/g, '');

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass
  }
});

/**
 * Send an email with HTML template
 */
export async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: `"Széchenyi 11. D Portál" <${user}>`,
    to,
    subject,
    text: text || html.replace(/<[^>]*>?/gm, ''),
    html
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * HTML Template for 6-digit registration verification code
 */
export function getVerificationEmailTemplate(code, email) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; margin: 0; }
      .container { max-width: 540px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 25px; }
      .title { font-size: 20px; font-weight: 700; color: #38bdf8; margin: 0; }
      .subtitle { font-size: 13px; color: #94a3b8; margin-top: 5px; }
      .code-box { background: rgba(56, 189, 248, 0.1); border: 2px dashed #38bdf8; border-radius: 8px; text-align: center; padding: 20px; margin: 25px 0; }
      .code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace; }
      .info { font-size: 14px; line-height: 1.6; color: #cbd5e1; }
      .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="title">Nyíregyházi SZC Széchenyi István Technikum</h1>
        <div class="subtitle">11. D Osztálypénz és Szülői Portál</div>
      </div>
      <p class="info">Kedves Szülő / Gondviselő!</p>
      <p class="info">Köszönjük a regisztrációját a 11. D osztály szülői portáljára (<strong>${email}</strong>). Kérjük, írja be az alábbi 6 jegyű megerősítő kódot a regisztráció befejezéséhez:</p>
      
      <div class="code-box">
        <div class="code">${code}</div>
      </div>

      <p class="info" style="font-size: 13px; color: #94a3b8;">A kód 15 percig érvényes. Ha nem Ön kezdeményezte a regisztrációt, kérjük hagyja figyelmen kívül ezt a levelet.</p>
      
      <div class="footer">
        © 2025/2026 Széchenyi 11. D Szülői Munkaközösség • Nyíregyháza<br>
        Adminisztrátor: rekalaca@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * HTML Template for password reset code
 */
export function getPasswordResetTemplate(code, email) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; margin: 0; }
      .container { max-width: 540px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 25px; }
      .title { font-size: 20px; font-weight: 700; color: #f59e0b; margin: 0; }
      .subtitle { font-size: 13px; color: #94a3b8; margin-top: 5px; }
      .code-box { background: rgba(245, 158, 11, 0.1); border: 2px dashed #f59e0b; border-radius: 8px; text-align: center; padding: 20px; margin: 25px 0; }
      .code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #f59e0b; font-family: monospace; }
      .info { font-size: 14px; line-height: 1.6; color: #cbd5e1; }
      .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="title">🔑 Jelszó Visszaállítás</h1>
        <div class="subtitle">Széchenyi 11. D Szülői Portál</div>
      </div>
      <p class="info">Jelszó-visszaállítási kérelem érkezett a következő fiókhoz: <strong>${email}</strong>.</p>
      <p class="info">Az új jelszó beállításához használja az alábbi 6 számjegyű biztonsági kódot:</p>
      
      <div class="code-box">
        <div class="code">${code}</div>
      </div>

      <p class="info" style="font-size: 13px; color: #94a3b8;">Ha nem Ön kérte a jelszó visszaállítását, fiókja biztonságban van, a levelet figyelmen kívül hagyhatja.</p>
      
      <div class="footer">
        © 2025/2026 Széchenyi 11. D Szülői Munkaközösség • Adminisztrátor: rekalaca@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * HTML Template for Teacher Nameday Reminder (3 days in advance)
 */
export function getNamedayReminderEmailTemplate({ teacherName, subject, namedayDisplay, daysLeft }) {
  const daysText = daysLeft === 0 ? 'MA van' : `${daysLeft} nap múlva lesz`;
  const timeNote = daysLeft === 0 ? 'Ma köszönthetitek fel!' : `Még van ${daysLeft} nap a virág / ajándék / köszöntés előkészítésére.`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b1320; color: #f8fafc; padding: 20px; margin: 0; }
      .container { max-width: 560px; margin: 0 auto; background: #162438; border-radius: 14px; border: 1px solid rgba(212, 175, 55, 0.3); padding: 32px; box-shadow: 0 12px 35px rgba(0,0,0,0.6); }
      .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 25px; }
      .title { font-size: 22px; font-weight: 800; color: #d4af37; margin: 0; letter-spacing: 0.5px; }
      .subtitle { font-size: 13px; color: #94a3b8; margin-top: 6px; }
      .celebration-box { background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(14, 42, 71, 0.25) 100%); border: 2px solid #d4af37; border-radius: 12px; text-align: center; padding: 24px; margin: 25px 0; }
      .teacher-name { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 4px; }
      .teacher-subject { font-size: 14px; color: #38bdf8; font-weight: 600; margin-bottom: 12px; }
      .nameday-badge { display: inline-block; background: #d4af37; color: #000; font-weight: 800; font-size: 14px; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; }
      .info { font-size: 14px; line-height: 1.6; color: #cbd5e1; }
      .countdown-highlight { background: rgba(56, 189, 248, 0.1); border-left: 4px solid #38bdf8; padding: 12px 16px; border-radius: 4px; margin: 18px 0; font-size: 14px; color: #e2e8f0; }
      .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="title">🎉 Tanári Névnap Emlékeztető</h1>
        <div class="subtitle">Nyíregyházi SZC Széchenyi István Technikum • 11. D Portál</div>
      </div>

      <p class="info">Kedves Laci / SZMK Vezetőség!</p>
      <p class="info">Az automatikus névnapfigyelő értesít, hogy a 11. D osztály egyik kedves tanárának névnapja közeledik:</p>
      
      <div class="celebration-box">
        <div class="teacher-name">💐 ${teacherName}</div>
        <div class="teacher-subject">${subject}</div>
        <div class="nameday-badge">Névnap: ${namedayDisplay} (${daysText})</div>
      </div>

      <div class="countdown-highlight">
        ⏰ <strong>Időzítés:</strong> ${timeNote}
      </div>

      <p class="info">
        Ne felejtsétek el felköszönteni az osztály nevében! 🎁
      </p>
      
      <div class="footer">
        © 2025/2026 Széchenyi 11. D Szülői Munkaközösség • Automata Névnaptár Rendszer
      </div>
    </div>
  </body>
  </html>
  `;
}
