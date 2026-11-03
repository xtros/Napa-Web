const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('C:/Users/APPUz/Documents/me/NAPA-backend/data/youpi_pg.sqlite');
db.exec(`
  UPDATE payment_receiving_accounts 
  SET upi_id = 'jwalithts@naviaxis', payee_name = 'NAPA SMP'
  WHERE id = '00000000-0000-0000-0000-000000000002';

  UPDATE merchants 
  SET business_name = 'NAPA SMP Store', slug = 'napa-smp'
  WHERE id = '00000000-0000-0000-0000-000000000001';
`);
console.log('Receiving Accounts:', db.prepare('SELECT id, upi_id, payee_name FROM payment_receiving_accounts').all());
console.log('Merchants:', db.prepare('SELECT id, business_name, slug FROM merchants').all());

