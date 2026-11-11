import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { authErrorMessage } from '@/lib/auth-messages';

export function ChangePasswordCard() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    if (password !== confirm) return setError('Las contraseñas no coinciden.');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(authErrorMessage(error));
    setPassword(''); setConfirm(''); setOpen(false);
    toast.success('Contraseña actualizada con éxito');
  }

  return (
    <section className="renew-box mb-8" aria-labelledby="pw-title">
      <div className="eyebrow">SEGURIDAD</div>
      <h2 id="pw-title">CAMBIAR CONTRASEÑA.</h2>
      {!open ? (
        <Button type="button" variant="outline" onClick={() => setOpen(true)}><KeyRound />Cambiar mi contraseña</Button>
      ) : (
        <form className="form-stack" onSubmit={submit}>
          <label className="field">Nueva contraseña
            <span className="relative block">
              <input className="w-full pr-12" type={show ? 'text' : 'password'} autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-11 w-11" aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShow((v) => !v)}>{show ? <EyeOff /> : <Eye />}</Button>
            </span>
          </label>
          <label className="field">Confirmar contraseña
            <input type={show ? 'text' : 'password'} autoComplete="new-password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          {error && <p role="alert" className="text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="sport" disabled={busy}>{busy ? 'Guardando…' : 'ACTUALIZAR CONTRASEÑA'}</Button>
            <Button type="button" variant="ghost" onClick={() => { setOpen(false); setError(''); }}>Cancelar</Button>
          </div>
        </form>
      )}
    </section>
  );
}
