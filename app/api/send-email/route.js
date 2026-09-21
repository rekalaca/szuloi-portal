import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const { to, subject, html, text } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { success: false, error: 'Hiányzó kötelező mezők (to, subject, html/text).' },
        { status: 400 }
      );
    }

    const info = await sendMail({ to, subject, html, text });
    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sikeresen elküldve a megadott címre!'
    });
  } catch (error) {
    console.error('Error in /api/send-email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Hiba történt az email küldése során.' },
      { status: 500 }
    );
  }
}
