import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xwbegziyfjoysjmrtsqy.supabase.co'
const supabaseKey = 'sb_publishable_m9UVUpnNMuXh6VWxj2t6cQ_SVKQKaOH'

export const supabaseClient = createClient(supabaseUrl, supabaseKey)
