const fs = require('fs');

// 1. Update apps/payment-api/src/server.js
const serverFile = 'C:/Users/APPUz/Documents/me/NAPA-backend/apps/payment-api/src/server.js';
let serverContent = fs.readFileSync(serverFile, 'utf8');

const oldCheck = `      if (origin && !origins.has(origin)) {
        HttpServer.json(res, 403, { error: 'Origin is not allowed.' });
        return;
      }`;

const newCheck = `      const isLocalhost = origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'));
      if (origin && !origins.has(origin) && !isLocalhost) {
        HttpServer.json(res, 403, { error: 'Origin is not allowed.' });
        return;
      }`;

if (serverContent.includes('if (origin && !origins.has(origin)) {')) {
  serverContent = serverContent.replace(
    /if \(origin && !origins\.has\(origin\)\) \{[\r\n\s]*HttpServer\.json\(res, 403, \{ error: 'Origin is not allowed\.' \}\);[\r\n\s]*return;[\r\n\s]*\}/,
    newCheck
  );
  fs.writeFileSync(serverFile, serverContent, 'utf8');
  console.log('✅ Updated server.js');
}

// 2. Update .env in NAPA-backend
const envFile = 'C:/Users/APPUz/Documents/me/NAPA-backend/.env';
let envContent = fs.readFileSync(envFile, 'utf8');

const allAllowed = 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:6001,http://127.0.0.1:6001,http://localhost:7000,http://127.0.0.1:7000,http://localhost:5000,http://localhost:8090,https://napa-two.vercel.app';
envContent = envContent.replace(/YOUPI_ALLOWED_ORIGINS=.*/, `YOUPI_ALLOWED_ORIGINS=${allAllowed}`);
envContent = envContent.replace(/YOUPI_ALLOWED_RETURN_ORIGINS=.*/, `YOUPI_ALLOWED_RETURN_ORIGINS=${allAllowed}`);

fs.writeFileSync(envFile, envContent, 'utf8');
console.log('✅ Updated NAPA-backend/.env');

