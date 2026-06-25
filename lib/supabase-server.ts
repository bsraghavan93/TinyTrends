import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function createNoopClient(): any {
  const noopResult = { data: null, error: { message: 'Supabase not configured' } }
  const handler: ProxyHandler<any> = {
    get: () => new Proxy(() => noopResult, handler),
    apply: () => new Proxy(Promise.resolve(noopResult), handler),
  }
  return new Proxy({}, handler)
}

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : createNoopClient()
