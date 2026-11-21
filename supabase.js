const SUPABASE_URL = "https://xkxvdxwfflfhwoubmbie.supabase.co";
const SUPABASE_KEY = "sb_publishable_JC3HbawGtMP0woDtlUhYkw_VSFi3Gtn";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);