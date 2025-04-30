import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://moanveycsbptqwnecodb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vYW52ZXljc2JwdHF3bmVjb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzM5MzYsImV4cCI6MjA2MTQ0OTkzNn0.A56pAyvfHvtWLlZFf-GZw3fKDyt5gbfjDk3mCG-vQsU';
export const supabase = createClient(supabaseUrl, supabaseKey);
