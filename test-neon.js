const { Client } = require('pg'); 
const client = new Client({ 
  connectionString: 'postgresql://neondb_owner:npg_opsxJd15OrgQ@ep-divine-meadow-agycvwoa-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' 
}); 

client.connect()
  .then(() => { 
    console.log('Connected to Neon!'); 
    return client.query('SELECT NOW() as time, version() as version'); 
  })
  .then(res => { 
    console.log('Time:', res.rows[0].time); 
    console.log('Version:', res.rows[0].version.split(',')[0]); 
    client.end(); 
  })
  .catch(e => { 
    console.error('Error:', e.message); 
    process.exit(1); 
  });
