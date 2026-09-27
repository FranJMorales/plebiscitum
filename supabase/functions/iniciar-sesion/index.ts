import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function cors(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    },
  });
}

// Solo para usuarios YA registrados: reenvia un enlace magico de acceso.
// shouldCreateUser=false evita que alguien cree una cuenta sin pasar por
// /registrar (y por tanto sin DNI/NIE ni telefono verificados).
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return cors({}, 200);
  if (req.method !== "POST") return cors({ error: "Metodo no permitido" }, 405);

  try {
    const { email } = await req.json();
    if (!email) return cors({ error: "Falta el email" }, 400);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) {
      const msg = String(error.message).toLowerCase();
      if (msg.includes("signups not allowed") || msg.includes("not found")) {
        return cors({ error: "No existe ninguna cuenta con ese email. Registrate primero." }, 404);
      }
      console.error(error);
      return cors({ error: "No se pudo enviar el enlace de acceso." }, 500);
    }

    return cors({ ok: true }, 200);
  } catch (e) {
    console.error(e);
    return cors({ error: "Solicitud invalida" }, 400);
  }
});
