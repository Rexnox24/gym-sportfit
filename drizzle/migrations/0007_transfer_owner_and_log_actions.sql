INSERT INTO public.user_roles (user_id, role) SELECT id, 'admin'::public.app_role FROM auth.users WHERE lower(email)='antoniobass.2@icloud.com' ON CONFLICT DO NOTHING;
DELETE FROM public.user_roles WHERE role='admin' AND user_id IN (SELECT id FROM auth.users WHERE lower(email)='axlahc@gmail.com');
UPDATE auth.users SET email_confirmed_at = coalesce(email_confirmed_at, now()) WHERE lower(email)='antoniobass.2@icloud.com';
CREATE OR REPLACE FUNCTION public.log_membership_change()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE act text;
BEGIN
 IF TG_OP = 'INSERT' THEN act := 'alta';
 ELSIF NEW.account_active IS DISTINCT FROM OLD.account_active THEN
  act := CASE WHEN NEW.account_active THEN 'reactivacion' ELSE 'desactivacion' END;
 ELSIF NEW.membership IS DISTINCT FROM OLD.membership OR NEW.membership_expires_at IS DISTINCT FROM OLD.membership_expires_at THEN
  IF NEW.membership IS NULL AND NEW.membership_expires_at IS NULL THEN act := 'suspension';
  ELSIF NEW.payment_status = 'paid' AND NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN act := 'pago_paypal';
  ELSIF NEW.payment_status = 'test' THEN act := 'pago_prueba';
  ELSIF OLD.membership IS NOT NULL AND NEW.membership IS DISTINCT FROM OLD.membership THEN act := 'cambio_plan';
  ELSIF NEW.membership IS NOT DISTINCT FROM OLD.membership AND OLD.membership_expires_at IS NOT NULL AND NEW.membership_expires_at IS NOT NULL THEN act := 'ajuste_vencimiento';
  ELSIF OLD.membership_expires_at IS NULL OR OLD.membership_expires_at < now() THEN
   act := CASE WHEN OLD.membership IS NULL THEN 'activacion' ELSE 'renovacion' END;
  ELSE act := 'renovacion';
  END IF;
 ELSIF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
  act := CASE WHEN NEW.payment_status IN ('manual','paid') THEN 'pago_manual' ELSE 'pago_pendiente' END;
 ELSE RETURN NEW;
 END IF;
 INSERT INTO public.membership_logs (user_id, actor_id, action, membership, expires_at)
 VALUES (NEW.id, auth.uid(), act, NEW.membership, NEW.membership_expires_at);
 RETURN NEW;
END $function$;
REVOKE EXECUTE ON FUNCTION public.log_membership_change() FROM anon, authenticated;