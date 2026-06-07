const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const WebSocket = require('ws');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for backend admin access

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env');
}

/**
 * FIX for "Error: Node.js 20 detected without native WebSocket support"
 * The @supabase/realtime-js library expects a global WebSocket or a transport option.
 * Since Node 20 doesn't have it globally by default, we assign it here.
 */
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = WebSocket;
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

module.exports = supabase;
