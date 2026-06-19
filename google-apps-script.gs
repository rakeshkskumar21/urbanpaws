/**
 * Urban Paws — Booking form -> Google Sheets + Telegram push notification
 *
 * Receives POST data from the "Book in under 2 minutes" form on index.html,
 * appends one row per booking to the spreadsheet, and sends an instant
 * Telegram message to your phone.
 *
 * SETUP (sheet side):
 *   1. Open your sheet -> Extensions -> Apps Script
 *   2. Paste this whole file, replacing any default code
 *   3. Deploy -> New deployment -> type "Web app"
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Copy the Web app URL and paste it into SHEET_ENDPOINT in index.html
 *
 * SETUP (Telegram side):  see the steps in the chat.
 *   - Create a bot via @BotFather  -> paste its token into TELEGRAM_BOT_TOKEN
 *   - Get your chat id from @userinfobot -> paste it into TELEGRAM_CHAT_ID
 */

var SHEET_ID = '1wiD8RSO7CTzuvOvJ4k8lLEsU8zlHryLU962VZy16ZAU';

// ====== Telegram settings ======
var TELEGRAM_BOT_TOKEN = '8986229504:AAE-AtX9oZ2CxfXjhkUhdnGH5M3TNsGMdvM';
var TELEGRAM_CHAT_ID   = '8952517954';

// ====== Email notification ======
// Sends an email on every booking (backup to Telegram). Your phone's mail
// app push will alert you. Leave blank ('') to disable email notifications.
// Multiple recipients: one string, comma-separated.
var NOTIFY_EMAIL = 'rakeshkskumar21@gmail.com,karthikk.rakesh@gmail.com';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    // Add a header row once, if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Service', 'Pet Name', 'Breed', 'Pet Age', 'Gender',
        'Address', 'Date', 'Time Slot', 'Phone', 'Payment', 'Instructions'
      ]);
    }

    var p = e.parameter;
    sheet.appendRow([
      new Date(),
      p.service      || '',
      p.petName      || '',
      p.breed        || '',
      p.petAge       || '',
      p.gender       || '',
      p.address      || '',
      p.date         || '',
      p.timeSlot     || '',
      p.phone        || '',
      p.payment      || '',
      p.instructions || ''
    ]);

    // Fire the notifications (won't block the row if either fails)
    sendTelegramNotification(p);
    sendEmailNotification(p);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendTelegramNotification(p) {
  if (TELEGRAM_BOT_TOKEN.indexOf('PASTE_') === 0 || TELEGRAM_CHAT_ID.indexOf('PASTE_') === 0) {
    return; // not configured yet — skip silently
  }
  p = p || {};               // guard: never crash on a missing payload

  var lines = [
    '🐾 *New Urban Paws Booking!*',
    '',
    '🛎 *Service:* ' + (p.service || '-'),
    '🐶 *Pet:* ' + (p.petName || '-') + ' (' + (p.breed || '-') + ')',
    '🎂 *Age:* ' + (p.petAge || '-') + '   ⚧ ' + (p.gender || '-'),
    '📍 *Address:* ' + (p.address || '-'),
    '📅 *Date:* ' + (p.date || '-') + '   ⏰ ' + (p.timeSlot || '-'),
    '📞 *Phone:* ' + (p.phone || '-'),
    '💳 *Payment:* ' + (p.payment || '-')
  ];
  if (p.instructions) lines.push('📝 *Notes:* ' + p.instructions);

  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
  var payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: lines.join('\n'),
    parse_mode: 'Markdown'
  };

  try {
    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (err) {
    // Don't fail the booking if Telegram is down
    console.error('Telegram send failed: ' + err);
  }
}

function sendEmailNotification(p) {
  if (!NOTIFY_EMAIL) return; // disabled
  p = p || {};               // guard: never crash on a missing payload

  var subject = '🐾 New Urban Paws Booking — ' + (p.service || 'Booking') +
                ' for ' + (p.petName || 'a pet');

  var htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#222">' +
      '<h2 style="margin:0 0 12px">🐾 New Urban Paws Booking!</h2>' +
      '<table cellpadding="6" style="border-collapse:collapse">' +
        row('🛎 Service',  p.service) +
        row('🐶 Pet',      (p.petName || '-') + ' (' + (p.breed || '-') + ')') +
        row('🎂 Age',      p.petAge) +
        row('⚧ Gender',    p.gender) +
        row('📍 Address',  p.address) +
        row('📅 Date',     p.date) +
        row('⏰ Time Slot', p.timeSlot) +
        row('📞 Phone',    p.phone) +
        row('💳 Payment',  p.payment) +
        (p.instructions ? row('📝 Notes', p.instructions) : '') +
      '</table>' +
    '</div>';

  // Plain-text fallback for clients that don't render HTML.
  var plain = [
    'New Urban Paws Booking!',
    'Service: '      + (p.service || '-'),
    'Pet: '          + (p.petName || '-') + ' (' + (p.breed || '-') + ')',
    'Age: '          + (p.petAge || '-') + '  Gender: ' + (p.gender || '-'),
    'Address: '      + (p.address || '-'),
    'Date: '         + (p.date || '-') + '  Time: ' + (p.timeSlot || '-'),
    'Phone: '        + (p.phone || '-'),
    'Payment: '      + (p.payment || '-'),
    p.instructions ? 'Notes: ' + p.instructions : ''
  ].join('\n');

  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: plain,
      htmlBody: htmlBody
    });
  } catch (err) {
    // Don't fail the booking if email is down
    console.error('Email send failed: ' + err);
  }
}

// Small helper to render one labeled row in the email table.
function row(label, value) {
  return '<tr>' +
    '<td style="font-weight:bold;white-space:nowrap;vertical-align:top">' + label + '</td>' +
    '<td>' + (value || '-') + '</td>' +
  '</tr>';
}

// Lets you open the Web app URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput('Urban Paws booking endpoint is running.');
}

// Run this once from the editor to test your Telegram + email setup.
function testTelegram() {
  var p = {
    service: 'Walk', petName: 'Bruno', breed: 'Labrador',
    petAge: '1–3 years', gender: 'Male', address: 'Test address',
    date: '2026-06-16', timeSlot: '7:00 AM – 8:00 AM',
    phone: '+91 98765 43210', payment: 'UPI', instructions: 'This is a test.'
  };
  sendTelegramNotification(p);
  sendEmailNotification(p);
}
