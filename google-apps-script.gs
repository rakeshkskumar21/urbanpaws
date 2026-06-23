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
var NOTIFY_EMAIL = 'urbanpawsbooking@gmail.com';

// Address that emails are sent FROM (also used as Reply-To).
// NOTE: to send AS this address, add it under Gmail -> Settings -> Accounts ->
// "Send mail as" and verify it on the Google account that runs this script.
// If it isn't a verified alias, Gmail ignores `from` and sends from the
// account's own address — `replyTo` still works regardless.
var FROM_EMAIL = 'hello@urbanpaws.app';
var FROM_NAME  = 'Urban Paws';

// ====== Booking ID settings ======
// Each service category gets its own 2-letter code. Anything that doesn't match
// falls back to 'UP' (Urban Paws).
var CATEGORY_CODES = {
  'Walk':        'WK',
  'Food':        'FD',
  'Grooming':    'GR',
  'Boarding':    'BD',
  'Vaccination': 'VC',
  'Pet Taxi':    'PT',
  'Taxi':        'PT'
};

// Counters start here, so the FIRST booking in a category is <code>10001
// (e.g. WK10001), matching the 5-digit "#UP10245" style.
var BOOKING_ID_START = 10000;

// Returns a guaranteed-unique, sequential booking ID for the given service,
// e.g. "WK10001", "WK10002", "GR10001". Uses a script lock so two bookings
// arriving at the same time can never get the same number.
function getNextBookingId(service) {
  service = service || '';
  var code = 'UP';
  for (var k in CATEGORY_CODES) {
    if (service.indexOf(k) !== -1) { code = CATEGORY_CODES[k]; break; }
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // wait up to 30s for any in-flight booking to finish
  try {
    var props = PropertiesService.getScriptProperties();
    var key = 'bookingCounter_' + code;
    var next = parseInt(props.getProperty(key) || String(BOOKING_ID_START), 10) + 1;
    props.setProperty(key, String(next));
    return code + next;
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    // Add a header row once, if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Booking ID', 'Service', 'Pet Name', 'Breed', 'Pet Age', 'Gender',
        'Address', 'Date', 'Time Slot', 'Phone', 'Email', 'Payment', 'Instructions'
      ]);
    }

    var p = (e && e.parameter) || {};

    // Generate the guaranteed-unique, sequential booking ID and expose it to the
    // email helpers via the same payload object.
    var bookingId = getNextBookingId(p.service);
    p.bookingId = bookingId;

    sheet.appendRow([
      new Date(),
      bookingId,
      p.service      || '',
      p.petName      || '',
      p.breed        || '',
      p.petAge       || '',
      p.gender       || '',
      p.address      || '',
      p.date         || '',
      p.timeSlot     || '',
      p.phone        || '',
      p.email        || '',
      p.payment      || '',
      p.instructions || ''
    ]);

    // Email the booking to the team (won't block the row if it fails)
    sendEmailNotification(p);

    // Email a confirmation to the customer, if they gave an email
    sendCustomerConfirmation(p);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', bookingId: bookingId }))
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

  var subject = '🐾 New Urban Paws Booking #' + (p.bookingId || '') + ' — ' +
                (p.service || 'Booking') + ' for ' + (p.petName || 'a pet');

  // Remaining email quota (recipients left today). Read before sending.
  var quotaLeft = MailApp.getRemainingDailyQuota();
  var quotaNote = 'Email quota left today: ' + quotaLeft + ' recipients (~' +
                  Math.floor(quotaLeft / 2) + ' bookings)';

  var htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#222">' +
      '<h2 style="margin:0 0 12px">🐾 New Urban Paws Booking!</h2>' +
      '<table cellpadding="6" style="border-collapse:collapse">' +
        row('🆔 Booking ID', '#' + (p.bookingId || '-')) +
        row('🛎 Service',  p.service) +
        row('🐶 Pet',      (p.petName || '-') + ' (' + (p.breed || '-') + ')') +
        row('🎂 Age',      p.petAge) +
        row('⚧ Gender',    p.gender) +
        row('📍 Address',  p.address) +
        row('📅 Date',     p.date) +
        row('⏰ Time Slot', p.timeSlot) +
        row('📞 Phone',    p.phone) +
        row('📧 Email',    p.email) +
        row('💳 Payment',  p.payment) +
        (p.instructions ? row('📝 Notes', p.instructions) : '') +
      '</table>' +
      '<p style="margin-top:14px;font-size:12px;color:#888">' + quotaNote + '</p>' +
    '</div>';

  // Plain-text fallback for clients that don't render HTML.
  var plain = [
    'New Urban Paws Booking!',
    'Booking ID: #'  + (p.bookingId || '-'),
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
      htmlBody: htmlBody,
      from: FROM_EMAIL,
      name: FROM_NAME,
      replyTo: FROM_EMAIL
    });
    console.log('sendEmailNotification: MailApp.sendEmail returned OK');
  } catch (err) {
    console.error('Email send failed: ' + err);
  }
}

// Sends a booking-confirmation email to the customer's own email address.
function sendCustomerConfirmation(p) {
  p = p || {};
  var to = (p.email || '').trim();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return; // no/invalid email -> skip

  var subject = '🐾 Your Urban Paws booking is confirmed — ' + (p.service || 'Booking');

  var htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#222">' +
      '<h2 style="margin:0 0 12px">🐾 Booking confirmed!</h2>' +
      '<p style="margin:0 0 14px">Hi' + (p.petName ? ' (' + p.petName + "'s parent)" : '') +
        ', thanks for booking with Urban Paws. Here are your details:</p>' +
      '<p style="margin:0 0 14px;font-size:16px"><strong>Your Booking ID: #' +
        (p.bookingId || '-') + '</strong> — please keep this for reference.</p>' +
      '<table cellpadding="6" style="border-collapse:collapse">' +
        row('🆔 Booking ID', '#' + (p.bookingId || '-')) +
        row('🛎 Service',  p.service) +
        row('🐶 Pet',      (p.petName || '-') + ' (' + (p.breed || '-') + ')') +
        row('📍 Address',  p.address) +
        row('📅 Date',     p.date) +
        row('⏰ Time Slot', p.timeSlot) +
        row('📞 Phone',    p.phone) +
        row('💳 Payment',  p.payment) +
        (p.instructions ? row('📝 Notes', p.instructions) : '') +
      '</table>' +
      '<p style="margin-top:14px">Your pet executive will be assigned shortly. ' +
        'If anything looks wrong, just reply to this email.</p>' +
      '<p style="margin-top:14px;color:#888">— The Urban Paws team</p>' +
    '</div>';

  var plain = [
    'Booking confirmed!',
    'Thanks for booking with Urban Paws. Here are your details:',
    'Booking ID: #' + (p.bookingId || '-') + ' (please keep this for reference)',
    'Service: '  + (p.service || '-'),
    'Pet: '      + (p.petName || '-') + ' (' + (p.breed || '-') + ')',
    'Address: '  + (p.address || '-'),
    'Date: '     + (p.date || '-') + '  Time: ' + (p.timeSlot || '-'),
    'Phone: '    + (p.phone || '-'),
    'Payment: '  + (p.payment || '-'),
    p.instructions ? 'Notes: ' + p.instructions : '',
    '',
    'Your pet executive will be assigned shortly.',
    '— The Urban Paws team'
  ].join('\n');

  try {
    console.log('sendCustomerConfirmation: sending to ' + to);
    MailApp.sendEmail({
      to: to,
      subject: subject,
      body: plain,
      htmlBody: htmlBody,
      from: FROM_EMAIL,
      name: FROM_NAME,
      replyTo: FROM_EMAIL
    });
    console.log('sendCustomerConfirmation: MailApp.sendEmail returned OK');
  } catch (err) {
    console.error('Customer confirmation send failed: ' + err);
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
  var p = {
    service: 'Walk', petName: 'Bruno', breed: 'Labrador',
    petAge: '1–3 years', gender: 'Male', address: 'Test address',
    date: '2026-06-16', timeSlot: '7:00 AM – 8:00 AM',
    phone: '+91 98765 43210', email: NOTIFY_EMAIL.split(',')[0],
    payment: 'UPI', instructions: 'This is a test.'
  };
  sendEmailNotification(p);
  sendCustomerConfirmation(p);
}
