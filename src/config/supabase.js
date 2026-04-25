import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vtbrnavffykjmkdmiijt.supabase.co'
const supabaseKey = 'sb_publishable_BeR9tEvAHHPfboo1p_T_eg_wIdG9GDZ'

export const supabaseClient = createClient(supabaseUrl, supabaseKey)
