/**
 * Urban Paws — Booking form -> Google Sheets + Email notification
 *
 * Receives POST data from the "Book in under 2 minutes" form on index.html,
 * appends one row per booking to the spreadsheet, and emails you the details.
 *
 * SETUP:
 *   1. Open your sheet -> Extensions -> Apps Script
 *   2. Select ALL existing code, delete it, and paste THIS whole file
 *   3. Save (Cmd/Ctrl + S)
 *   4. Run `testEmail` once -> approve the authorization prompt
 *   5. Deploy -> Manage deployments -> Edit (pencil) -> Version: New version -> Deploy
 *      (Keeps the same Web app URL, so index.html needs no change.)
 */

var SHEET_ID = '1wiD8RSO7CTzuvOvJ4k8lLEsU8zlHryLU962VZy16ZAU';

// ====== Email notification ======
// Who gets the booking email. Multiple recipients: one comma-separated string.
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

    var p = (e && e.parameter) || {};
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

    // Email the booking (won't block the row if it fails)
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

function sendEmailNotification(p) {
  if (!NOTIFY_EMAIL) return; // disabled
  p = p || {};               // guard: never crash on a missing payload

  var subject = '🐾 New Urban Paws Booking — ' + (p.service || 'Booking') +
                ' for ' + (p.petName || 'a pet');

  // Remaining email quota (recipients left today). Read before sending.
  var quotaLeft = MailApp.getRemainingDailyQuota();
  var quotaNote = 'Email quota left today: ' + quotaLeft + ' recipients (~' +
                  Math.floor(quotaLeft / 2) + ' bookings)';

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
      '<p style="margin-top:14px;font-size:12px;color:#888">' + quotaNote + '</p>' +
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
    p.instructions ? 'Notes: ' + p.instructions : '',
    '',
    quotaNote
  ].join('\n');

  try {
    console.log('sendEmailNotification: sending to ' + NOTIFY_EMAIL +
                ' | remaining quota=' + quotaLeft);
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: plain,
      htmlBody: htmlBody
    });
    console.log('sendEmailNotification: MailApp.sendEmail returned OK');
  } catch (err) {
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

// Run this from the editor to see how many emails you can still send today.
function checkQuota() {
  console.log('Emails left today: ' + MailApp.getRemainingDailyQuota());
}

// Run this once from the editor to test your email setup.
function testEmail() {
  sendEmailNotification({
    service: 'Walk', petName: 'Bruno', breed: 'Labrador',
    petAge: '1–3 years', gender: 'Male', address: 'Test address',
    date: '2026-06-16', timeSlot: '7:00 AM – 8:00 AM',
    phone: '+91 98765 43210', payment: 'UPI', instructions: 'This is a test.'
  });
}
