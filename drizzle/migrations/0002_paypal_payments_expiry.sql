ALTER TABLE public.profiles ADD COLUMN membership_expires_at timestamptz;
CREATE INDEX profiles_expires_idx ON public.profiles (membership_expires_at);
CREATE TABLE public.payments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 plan text NOT NULL,
 amount numeric(10,2) NOT NULL,
 currency text NOT NULL DEFAULT 'MXN',
 paypal_order_id text NOT NULL UNIQUE,
 status text NOT NULL DEFAULT 'completed',
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX payments_user_idx ON public.payments (user_id, created_at DESC);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_read_own ON public.payments FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE TABLE public.expiry_notices (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 kind text NOT NULL CHECK (kind IN ('3_dias','dia')),
 expires_at timestamptz NOT NULL,
 sent_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE (user_id, kind, expires_at)
);
GRANT ALL ON public.expiry_notices TO service_role;
ALTER TABLE public.expiry_notices ENABLE ROW LEVEL SECURITY;