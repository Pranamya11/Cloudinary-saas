// scripts/test-cloudinary.js
const cloudinary = require('cloudinary').v2;

console.log('Testing Cloudinary Configuration...\n');

// Check environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Environment variables:');
console.log('CLOUDINARY_CLOUD_NAME:', cloudName ? '✓ Set' : '✗ Missing');
console.log('CLOUDINARY_API_KEY:', apiKey ? '✓ Set' : '✗ Missing');
console.log('CLOUDINARY_API_SECRET:', apiSecret ? '✓ Set' : '✗ Missing');

if (!cloudName || !apiKey || !apiSecret) {
  console.error('\n❌ Missing Cloudinary environment variables!');
  console.log('Get them from: https://console.cloudinary.com/settings/api');
  process.exit(1);
}

// Configure
cloudinary.config({
  cloud_name: dbgxb3lph,
  api_key: a646223565834759,
  api_secret: oQtgZXMDq-FMrgDIoUUITnIaz00,
  secure: true,
});

// Test connection
cloudinary.api.ping()
  .then(result => {
    console.log('\n✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    console.log('Service:', result.service);
  })
  .catch(error => {
    console.error('\n❌ Cloudinary connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('Invalid credentials')) {
      console.log('\nPossible issues:');
      console.log('1. Check your Cloudinary account is active');
      console.log('2. Verify API key/secret are correct');
      console.log('3. Ensure no typos in cloud_name');
    }
    process.exit(1);
  });