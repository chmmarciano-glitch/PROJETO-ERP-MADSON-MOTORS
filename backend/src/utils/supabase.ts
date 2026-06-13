import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import logger from './logger';

// Cliente Supabase com service_role (acesso total — só no backend!)
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'madson_motors',
    },
  }
);

// Cliente anon (para client-side — não usar aqui)
export const supabaseAnon = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    db: {
      schema: 'madson_motors',
    },
  }
);

logger.info('✅ Supabase client conectado ao schema madson_motors');

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('departamentos')
      .select('id')
      .limit(1);

    if (error) {
      logger.error('❌ Supabase connection error:', error);
      return false;
    }

    logger.info('✅ Supabase connection test PASSED');
    return true;
  } catch (error) {
    logger.error('❌ Supabase connection test FAILED:', error);
    return false;
  }
}
