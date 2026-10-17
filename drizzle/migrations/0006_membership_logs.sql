ALTER TABLE public.profiles ADD COLUMN account_active boolean NOT NULL DEFAULT true;

CREATE TABLE public.membership_logs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 actor_id uuid,
 action text NOT NULL,
 membership text,
 expires_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX membership_logs_created_idx ON public.membership_logs (created_at DESC);
GRANT SELECT ON public.membership_logs TO authenticated;
GRANT ALL ON public.membership_logs TO service_role;
ALTER TABLE public.membership_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY membership_logs_admin_read ON public.membership_logs FOR SELECT TO authenticated USING (public.has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.log_membership_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE act text;
BEGIN
 IF TG_OP = 'INSERT' THEN act := 'alta';
 ELSIF NEW.account_active IS DISTINCT FROM OLD.account_active THEN
  act := CASE WHEN NEW.account_active THEN 'reactivacion' ELSE 'desactivacion' END;
 ELSIF NEW.membership IS DISTINCT FROM OLD.membership OR NEW.membership_expires_at IS DISTINCT FROM OLD.membership_expires_at THEN
  IF NEW.membership IS NULL AND NEW.membership_expires_at IS NULL THEN act := 'suspension';
  ELSIF NEW.payment_status = 'paid' AND NEW.membership_expires_at IS DISTINCT FROM OLD.membership_expires_at THEN act := 'pago_paypal';
  ELSIF OLD.membership IS NOT NULL AND NEW.membership IS DISTINCT FROM OLD.membership THEN act := 'cambio_plan';
  ELSIF OLD.membership_expires_at IS NULL OR OLD.membership_expires_at < now() THEN
   act := CASE WHEN OLD.membership IS NULL THEN 'activacion' ELSE 'renovacion' END;
  ELSE act := 'renovacion';
  END IF;
 ELSE RETURN NEW;
 END IF;
 INSERT INTO public.membership_logs (user_id, actor_id, action, membership, expires_at)
 VALUES (NEW.id, auth.uid(), act, NEW.membership, NEW.membership_expires_at);
 RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.log_membership_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER profiles_log_membership AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.log_membership_change();