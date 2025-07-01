import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bstmdpqrlpdsckicniip.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdG1kcHFybHBkc2NraWNuaWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTU3MDksImV4cCI6MjA2NjkzMTcwOX0.euw5W6783F0TyqZUnMS0Z-4auyiq-MP4fiLvWNgJP1I'

export const supabase = createClient(supabaseUrl, supabaseKey)