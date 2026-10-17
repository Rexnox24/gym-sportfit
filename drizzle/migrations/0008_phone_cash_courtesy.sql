ALTER TABLE public.profiles DROP CONSTRAINT profiles_payment_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_payment_status_check CHECK (payment_status IN ('unrecorded','paid','pending','overdue','manual','test'));
ALTER TABLE public.profiles ADD COLUMN phone text CHECK (phone IS NULL OR char_length(phone) <= 20);
ALTER TABLE public.payments ADD COLUMN method text NOT NULL DEFAULT 'paypal';
CREATE OR REPLACE FUNCTION public.create_member_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.profiles (id, display_name, phone) VALUES (new.id, left(coalesce(new.raw_user_meta_data->>'display_name',new.raw_user_meta_data->>'full_name',''),100), nullif(left(regexp_replace(coalesce(new.raw_user_meta_data->>'phone',''),'[^0-9+ ]','','g'),20),''));
 RETURN new;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.create_member_profile() FROM PUBLIC, anon, authenticated;
UPDATE public.profiles SET membership = 'Cortesía / Staff', membership_expires_at = NULL, payment_status = 'manual' WHERE id = '4e82d72e-1919-4b60-86e3-2b9efb683d6a';