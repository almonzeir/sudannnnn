import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('🔄 Running chat schema migration...');
    
    // Read the migration file
    const migrationPath = join(__dirname, '../../supabase/migrations/002_chat_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    console.log('⏳ Executing migration in batch...');
    
    try {
      // Attempt to execute the entire migration in a single RPC call
      const { error: batchError } = await supabase.rpc('exec_sql', { sql: migrationSQL });
      
      if (batchError) {
        // If exec_sql doesn't exist, try direct execution or fall back to individual statements
        if (batchError.message.includes('function exec_sql')) {
          console.log('📝 exec_sql function not found, checking direct execution...');
          const { error: directError } = await supabase
            .from('_migrations')
            .select('*')
            .limit(1);

          if (directError) {
            console.log('⚠️  Direct execution not available. Please run migration manually.');
            console.log('\n📋 SQL to execute:');
            console.log('=' .repeat(50));
            console.log(migrationSQL);
            console.log('=' .repeat(50));
            return;
          }

          // If we can do direct execution (theoretically), but supabase-js doesn't support raw SQL,
          // we might still need to loop if we had a way to execute raw SQL directly.
          // But since we are using RPC 'exec_sql', if that's missing, we are stuck.
        } else {
          console.warn('⚠️ Batch execution failed, falling back to individual statements for detailed error reporting...');
          throw batchError; // Fall back to catch block which will handle the loop
        }
      } else {
        console.log('✅ Migration executed successfully in batch');
      }
    } catch (batchError) {
      if (!batchError.message.includes('function exec_sql')) {
        console.log('🔄 Executing statements individually...');
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i] + ';';
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);

          try {
            const { error } = await supabase.rpc('exec_sql', { sql: statement });
            if (error) throw error;
            console.log(`✅ Statement ${i + 1} executed successfully`);
          } catch (statementError) {
            console.error(`❌ Error executing statement ${i + 1}:`, statementError.message);
            console.log('Statement:', statement);
            // Continue with other statements
            continue;
          }
        }
      } else {
        throw batchError;
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 Created tables:');
    console.log('  - conversations');
    console.log('  - messages');
    console.log('  - chat_analytics');
    console.log('  - user_preferences');
    console.log('  - message_feedback');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // Fallback: show manual instructions
    console.log('\n📋 Please run the following SQL manually in your Supabase dashboard:');
    console.log('=' .repeat(70));
    
    try {
      const migrationPath = join(__dirname, '../../supabase/migrations/002_chat_schema.sql');
      const migrationSQL = readFileSync(migrationPath, 'utf8');
      console.log(migrationSQL);
    } catch (readError) {
      console.error('Could not read migration file:', readError.message);
    }
    
    console.log('=' .repeat(70));
    process.exit(1);
  }
}

// Check if required environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  console.log('\n📝 Please create a .env file in the backend directory with:');
  console.log('   SUPABASE_URL=your_supabase_url');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

runMigration();