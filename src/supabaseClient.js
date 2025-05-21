import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzhupclgibgydtcwmmpz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6aHVwY2xnaWJneWR0Y3dtbXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NzkzMTcsImV4cCI6MjA2MjA1NTMxN30.ud3vpI_4oagMLxGvy8IBLtFXeeELsXiZTRxNIsCkcMc';
export const supabase = createClient(supabaseUrl, supabaseKey);
