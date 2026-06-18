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

    // Fire the push notification (won't block the row if it fails)
    sendTelegramNotification(p);

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

// Lets you open the Web app URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput('Urban Paws booking endpoint is running.');
}

// Run this once from the editor to test your Telegram setup.
function testTelegram() {
  sendTelegramNotification({
    service: 'Walk', petName: 'Bruno', breed: 'Labrador',
    petAge: '1–3 years', gender: 'Male', address: 'Test address',
    date: '2026-06-16', timeSlot: '7:00 AM – 8:00 AM',
    phone: '+91 98765 43210', payment: 'UPI', instructions: 'This is a test.'
  });
}
