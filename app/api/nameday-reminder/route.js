import { NextResponse } from 'next/server';
import { sendMail, getNamedayReminderEmailTemplate } from '@/lib/mailer';
import { DEFAULT_TEACHERS } from '@/lib/initialData';

// Helper to calculate days until nameday
function getDaysUntilNameday(namedayStr) {
  if (!namedayStr) return 999;
  const [monthStr, dayStr] = namedayStr.split('-');
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  
  let targetDate = new Date(currentYear, month, day, 0, 0, 0);
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  // If nameday already passed this year, look at next year
  if (targetDate < todayZero) {
    targetDate = new Date(currentYear + 1, month, day, 0, 0, 0);
  }

  const diffMs = targetDate.getTime() - todayZero.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// In-memory or fallback record of sent reminders for this process
const sentReminders = new Set();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const triggerEmails = searchParams.get('trigger') === 'true';
    const targetEmail = searchParams.get('email') || 'rekalaca@gmail.com';

    const teachersWithCountdown = DEFAULT_TEACHERS.map((t) => {
      const daysLeft = getDaysUntilNameday(t.nameday);
      return {
        ...t,
        daysLeft,
        isUpcoming3Days: daysLeft >= 0 && daysLeft <= 3,
        isToday: daysLeft === 0
      };
    }).sort((a, b) => a.daysLeft - b.daysLeft);

    const sentList = [];

    if (triggerEmails) {
      const currentYear = new Date().getFullYear();
      for (const t of teachersWithCountdown) {
        // Condition: exactly 3 days away (or today)
        if (t.daysLeft === 3 || t.daysLeft === 0) {
          const reminderKey = `${t.id}-${currentYear}-${t.daysLeft}`;
          if (!sentReminders.has(reminderKey)) {
            try {
              const html = getNamedayReminderEmailTemplate({
                teacherName: t.name,
                subject: t.subject,
                namedayDisplay: t.namedayDisplay,
                daysLeft: t.daysLeft
              });

              await sendMail({
                to: targetEmail,
                subject: `🎉 Névnap Emlékeztető: ${t.name} névnapja ${t.daysLeft === 0 ? 'MA van' : t.daysLeft + ' nap múlva lesz'} (${t.namedayDisplay})!`,
                html
              });

              sentReminders.add(reminderKey);
              sentList.push({ teacher: t.name, daysLeft: t.daysLeft, email: targetEmail });
            } catch (mailErr) {
              console.warn('Failed to send nameday reminder email for:', t.name, mailErr.message);
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      currentDate: new Date().toISOString().split('T')[0],
      teachers: teachersWithCountdown,
      sentReminders: sentList
    });
  } catch (error) {
    console.error('Error in /api/nameday-reminder:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action, teacherId, targetEmail } = await request.json();
    const recipient = targetEmail || 'rekalaca@gmail.com';

    if (action === 'test') {
      const teacher = DEFAULT_TEACHERS.find(t => t.id === teacherId) || DEFAULT_TEACHERS[0];
      const daysLeft = teacher.nameday ? getDaysUntilNameday(teacher.nameday) : 3;

      const html = getNamedayReminderEmailTemplate({
        teacherName: teacher.name,
        subject: teacher.subject,
        namedayDisplay: teacher.namedayDisplay,
        daysLeft: daysLeft === 999 ? 3 : daysLeft
      });

      await sendMail({
        to: recipient,
        subject: `🎉 [TESZT] Névnap Emlékeztető: ${teacher.name} (${teacher.namedayDisplay})`,
        html
      });

      return NextResponse.json({
        success: true,
        message: `Teszt emlékeztető sikeresen elküldve a következő címre: ${recipient} (${teacher.name})`
      });
    }

    return NextResponse.json({ success: false, error: 'Érvénytelen művelet' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/nameday-reminder:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
