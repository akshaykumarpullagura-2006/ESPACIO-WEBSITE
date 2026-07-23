import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Helper to authenticate with Google Sheets API
const getAuth = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (email && privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
    return new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
  }

  // Fallback to checking google-credentials.json in the server root
  const credentialsPath = path.resolve('google-credentials.json');
  if (fs.existsSync(credentialsPath)) {
    try {
      const creds = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      if (creds.client_email && creds.private_key) {
        const formattedKey = creds.private_key.replace(/\\n/g, '\n');
        return new google.auth.JWT({
          email: creds.client_email,
          key: formattedKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
      }
    } catch (err) {
      console.error('Google Sheets API: Error parsing credentials file:', err.message);
    }
  }

  return null;
};

// Helper to ensure a sheet exists and has headers
const ensureSheetExists = async (sheets, spreadsheetId, sheetName, headers) => {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetExists = meta.data.sheets.some(s => s.properties.title === sheetName);

    if (!sheetExists) {
      console.log(`Google Sheets: Sheet "${sheetName}" not found. Creating sheet...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });

      // Write headers to row 1
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headers],
        },
      });
      console.log(`Google Sheets: Created sheet "${sheetName}" and wrote header columns.`);
    }
  } catch (err) {
    console.error(`Google Sheets: Failed to verify/create sheet "${sheetName}":`, err.message);
  }
};

/**
 * Appends a lead or material enquiry to the target Google Sheet.
 * @param {string} type - 'contact' or 'material'
 * @param {object} data - Form data payload
 */
export const appendToGoogleSheet = async (type, data) => {
  try {
    const auth = getAuth();
    if (!auth) {
      console.warn('Google Sheets API: No credentials found. Check your GOOGLE_SERVICE_ACCOUNT_EMAIL & GOOGLE_PRIVATE_KEY or google-credentials.json.');
      return null;
    }

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1xT3RbueFsMwGm8FgtvZwK6J_U8sa9YNfwu2yVYYMTE0';

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    if (type === 'contact') {
      const sheetName = 'Contact Requests';
      const headers = [
        'Timestamp',
        'Lead ID',
        'Looking For',
        'Property Type',
        'Spaces / Rooms',
        'Location',
        'Project Stage',
        'Additional Notes',
        'Full Name',
        'Mobile Number',
        'Email Address',
        'Source',
        'Status',
        'Assigned To',
        'Follow-up Date',
        'Last Updated',
        'Remarks',
        'IP Address'
      ];

      // 1. Ensure sheet exists
      await ensureSheetExists(sheets, spreadsheetId, sheetName, headers);

      // 2. Fetch Lead IDs to determine next ID
      let nextId = 'ESP-000001';
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!B2:B`,
        });
        const rows = response.data.values;
        if (rows && rows.length > 0) {
          const lastIdStr = rows[rows.length - 1][0];
          if (lastIdStr && lastIdStr.startsWith('ESP-')) {
            const match = lastIdStr.match(/ESP-(\d+)/);
            if (match) {
              const num = parseInt(match[1], 10);
              nextId = `ESP-${String(num + 1).padStart(6, '0')}`;
            }
          }
        }
      } catch (err) {
        console.warn('Google Sheets API: Read error, defaulting to ESP-000001. Error:', err.message);
      }

      // Column ordering exactly as requested
      const rowValues = [
        timestamp,                  // Timestamp
        nextId,                     // Lead ID
        data.lookingFor || 'N/A',   // Looking For
        data.propertyType || 'N/A', // Property Type
        data.spaces || 'N/A',       // Spaces / Rooms
        data.location || 'N/A',     // Location
        data.projectStage || 'N/A', // Project Stage
        data.notes || 'None',       // Additional Notes
        data.name || 'N/A',         // Full Name
        data.phone || 'N/A',        // Mobile Number
        data.email || 'N/A',        // Email Address
        'Website',                  // Source (Default: Website)
        'New',                      // Status (Default: New)
        '',                         // Assigned To (Default: Blank)
        '',                         // Follow-up Date (Default: Blank)
        timestamp,                  // Last Updated
        '',                         // Remarks (Default: Blank)
        data.ipAddress || 'N/A'     // IP Address
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:R`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowValues],
        },
      });

      console.log(`Google Sheets API: Appended row to "Contact Requests" with ID ${nextId}`);
      return { id: nextId };

    } else if (type === 'catalogue') {
      const sheetName = 'Catalogue Requests';
      const headers = [
        'Timestamp',
        'Enquiry ID',
        'Customer Name',
        'Contact Number 1',
        'Contact Number 2',
        'Email Address',
        'Project Location',
        'Catalogue Material',
        'Source',
        'Status',
        'Last Updated',
        'IP Address'
      ];

      // 1. Ensure sheet exists
      await ensureSheetExists(sheets, spreadsheetId, sheetName, headers);

      // 2. Fetch Enquiry IDs to determine next ID
      let nextId = 'CAT-000001';
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!B2:B`,
        });
        const rows = response.data.values;
        if (rows && rows.length > 0) {
          const lastIdStr = rows[rows.length - 1][0];
          if (lastIdStr && lastIdStr.startsWith('CAT-')) {
            const match = lastIdStr.match(/CAT-(\d+)/);
            if (match) {
              const num = parseInt(match[1], 10);
              nextId = `CAT-${String(num + 1).padStart(6, '0')}`;
            }
          }
        }
      } catch (err) {
        console.warn('Google Sheets API: Read error, defaulting to CAT-000001. Error:', err.message);
      }

      // Column ordering
      const rowValues = [
        timestamp,                  // Timestamp
        nextId,                     // Enquiry ID
        data.name || 'N/A',         // Customer Name
        data.phone1 || 'N/A',       // Contact Number 1
        data.phone2 || '',          // Contact Number 2 (Optional)
        data.email || 'N/A',        // Email Address
        data.location || 'N/A',     // Project Location
        data.catalogueMaterial || 'N/A', // Catalogue Material
        'Website',                  // Source
        'New',                      // Status
        timestamp,                  // Last Updated
        data.ipAddress || 'N/A'     // IP Address
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:L`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowValues],
        },
      });

      console.log(`Google Sheets API: Appended row to "Catalogue Requests" with ID ${nextId}`);
      return { id: nextId };

    } else if (type === 'material') {
      const sheetName = 'Material Enquiries';
      const headers = [
        'Timestamp',
        'Enquiry ID',
        'Customer Name',
        'Contact Number 1',
        'Contact Number 2',
        'Email Address',
        'Project Location',
        'Source',
        'Status',
        'Assigned To',
        'Follow-up Date',
        'Last Updated',
        'Remarks',
        'IP Address'
      ];

      // 1. Ensure sheet exists
      await ensureSheetExists(sheets, spreadsheetId, sheetName, headers);

      // 2. Fetch Enquiry IDs to determine next ID
      let nextId = 'MAT-000001';
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!B2:B`,
        });
        const rows = response.data.values;
        if (rows && rows.length > 0) {
          const lastIdStr = rows[rows.length - 1][0];
          if (lastIdStr && lastIdStr.startsWith('MAT-')) {
            const match = lastIdStr.match(/MAT-(\d+)/);
            if (match) {
              const num = parseInt(match[1], 10);
              nextId = `MAT-${String(num + 1).padStart(6, '0')}`;
            }
          }
        }
      } catch (err) {
        console.warn('Google Sheets API: Read error, defaulting to MAT-000001. Error:', err.message);
      }

      // Column ordering exactly as requested
      const rowValues = [
        timestamp,                  // Timestamp
        nextId,                     // Enquiry ID
        data.name || 'N/A',         // Customer Name
        data.phone1 || 'N/A',       // Contact Number 1
        data.phone2 || '',          // Contact Number 2 (Optional)
        data.email || 'N/A',        // Email Address
        data.location || 'N/A',     // Project Location
        'Website',                  // Source (Default: Website)
        'New',                      // Status (Default: New)
        '',                         // Assigned To (Default: Blank)
        '',                         // Follow-up Date (Default: Blank)
        timestamp,                  // Last Updated
        '',                         // Remarks (Default: Blank)
        data.ipAddress || 'N/A'     // IP Address
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:N`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowValues],
        },
      });

      console.log(`Google Sheets API: Appended row to "Material Enquiries" with ID ${nextId}`);
      return { id: nextId };
    }
  } catch (err) {
    console.error('Google Sheets API Error in appendToGoogleSheet:', err);
    throw err;
  }
};
