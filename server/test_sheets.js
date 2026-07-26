import { appendToGoogleSheet } from './services/googleSheetsService.js';

console.log('Testing Google Sheets connection...');
appendToGoogleSheet('contact', {
  name: 'Test User (Antigravity Verify)',
  phone: '9999999999',
  email: 'test@espacio.com',
  lookingFor: 'Verify Integration',
  propertyType: 'Office',
  spaces: 'Conference Room',
  location: 'Hyderabad',
  projectStage: 'Design Stage',
  notes: 'This is an automated test entry to verify Google Sheets Integration.',
  ipAddress: '127.0.0.1'
})
.then(res => {
  console.log('SUCCESS: Connection and write verified. Result:', res);
  process.exit(0);
})
.catch(err => {
  console.error('FAILURE: Error testing connection:', err);
  process.exit(1);
});
