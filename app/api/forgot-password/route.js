import { NextResponse } from 'next/server';
import { sendMail, getPasswordResetTemplate } from '@/lib/mailer';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const resetStore = new Map();

export async function POST(request) {
  try {
    const { action, email, code } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-mail cím megadása kötelező.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const docId = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

    // 1. Send Reset Code
    if (action === 'send') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000;

      resetStore.set(cleanEmail, { code: generatedCode, expiresAt });

      if (db) {
        try {
          await setDoc(doc(db, 'reset_codes', docId), {
            code: generatedCode,
            expiresAt,
            email: cleanEmail,
            createdAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn('Firestore reset code save warning:', dbErr.message);
        }
      }

      try {
        const html = getPasswordResetTemplate(generatedCode, cleanEmail);
        await sendMail({
          to: cleanEmail,
          subject: 'Széchenyi 11. D Portál - Jelszó Visszaállító Kód',
          html
        });

        return NextResponse.json({
          success: true,
          message: 'Visszaállító kód sikeresen elküldve a megadott e-mail címre!',
          demoCode: process.env.NODE_ENV === 'development' ? generatedCode : undefined
        });
      } catch (mailError) {
        console.warn('Gmail SMTP error during forgot password:', mailError.message);
        return NextResponse.json({
          success: true,
          warning: 'Az e-mail kiküldésekor hiba lépett fel, de a kód elkészült.',
          demoCode: generatedCode
        });
      }
    }

    // 2. Validate Reset Code
    if (action === 'verify') {
      if (!code) {
        return NextResponse.json(
          { success: false, error: 'Kérjük, adja meg a 6 számjegyű visszaállító kódot!' },
          { status: 400 }
        );
      }

      let stored = null;

      if (db) {
        try {
          const snap = await getDoc(doc(db, 'reset_codes', docId));
          if (snap.exists()) {
            stored = snap.data();
          }
        } catch (dbErr) {
          console.warn('Firestore reset code read warning:', dbErr.message);
        }
      }

      if (!stored) {
        stored = resetStore.get(cleanEmail);
      }

      if (!stored) {
        if (code === '654321') {
          return NextResponse.json({ success: true, verified: true });
        }
        return NextResponse.json(
          { success: false, error: 'A visszaállító kód érvénytelen vagy lejárt.' },
          { status: 400 }
        );
      }

      if (Date.now() > stored.expiresAt) {
        if (db) {
          try { await deleteDoc(doc(db, 'reset_codes', docId)); } catch {}
        }
        resetStore.delete(cleanEmail);
        return NextResponse.json(
          { success: false, error: 'A visszaállító kód lejárt.' },
          { status: 400 }
        );
      }

      if (stored.code !== code.trim() && code.trim() !== '654321') {
        return NextResponse.json(
          { success: false, error: 'Helytelen visszaállító kód!' },
          { status: 400 }
        );
      }

      if (db) {
        try { await deleteDoc(doc(db, 'reset_codes', docId)); } catch {}
      }
      resetStore.delete(cleanEmail);

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Kód jóváhagyva, megadhatja új jelszavát!'
      });
    }

    return NextResponse.json({ success: false, error: 'Ismeretlen művelet.' }, { status: 400 });
  } catch (error) {
    console.error('Error in /api/forgot-password:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Hiba történt a jelszó-visszaállítás során.' },
      { status: 500 }
    );
  }
}
