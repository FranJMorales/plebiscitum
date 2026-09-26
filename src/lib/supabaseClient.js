import { createClient } from '@supabase/supabase-js';

// Lee la URL y la clave publicable desde variables de entorno (Vite).
// Ver .env.example para los valores de este proyecto.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
