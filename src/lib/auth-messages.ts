/** Traduce errores de registro/acceso a mensajes claros en español. */
export function authErrorMessage(e: unknown): string {
 const err = e as { code?: string; name?: string; message?: string } | null;
 const msg = (err?.message ?? '').toLowerCase();
 const code = err?.code ?? '';
 if (code === 'weak_password' || err?.name === 'AuthWeakPasswordError' || /weak|pwned|easy to guess|leaked|compromised/.test(msg))
  return 'Esta contraseña es muy común o fácil de adivinar. Por tu seguridad, elige una combinación más segura (mínimo 8 caracteres combinando letras y números o símbolos).';
 if (code === 'user_already_exists' || code === 'email_exists' || /already registered|already exists/.test(msg))
  return "Este correo ya está registrado. Cambia a 'Iniciar sesión' o recupera tu contraseña.";
 if (msg.includes('invalid login')) return 'El correo o la contraseña no son correctos.';
 if (msg.includes('confirmed')) return 'Confirma tu correo antes de entrar.';
 return 'No pudimos completar la solicitud. Revisa los datos e inténtalo de nuevo.';
}
export function passwordChecks(p: string) {
 return [
  { label: 'Mínimo 8 caracteres', ok: p.length >= 8 },
  { label: 'Incluye letras', ok: /[a-zA-ZÀ-ÿ]/.test(p) },
  { label: 'Incluye números', ok: /\d/.test(p) },
 ];
}
