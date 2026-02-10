// cloudinary-testing.ts

const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);


// Test Cloudinary connection
cloudinary.api.ping((err, result) => {
  if (err) {
    console.error("Cloudinary Ping Failed:", err);
  } else {
    console.log("Cloudinary Ping Success:", result);
  }
});
