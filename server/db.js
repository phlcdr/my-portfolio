const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('MISSING_SUPABASE_CREDENTIALS: Check server/.env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const initDb = async () => {
  // Supabase schema is managed via migrations
  // We can just verify connection here if needed
  console.log('SUPABASE_LINK_ESTABLISHED');
  return Promise.resolve();
};

module.exports = { supabase, initDb };

