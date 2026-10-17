import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { getPaypalConfig, createPaypalOrder, capturePaypalOrder } from '@/lib/paypal.functions';
import type { PlanId } from '@/lib/plans';

type PaypalNs = { Buttons: (o: Record<string, unknown>) => { render: (el: HTMLElement) => Promise<void>; close: () => void } };
let sdkPromise: Promise<PaypalNs> | null = null;
function loadSdk(clientId: string) {
 if (!sdkPromise) sdkPromise = new Promise((resolve, reject) => {
  const s = document.createElement('script');
  s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=MXN&intent=capture&locale=es_MX`;
  s.onload = () => resolve((window as unknown as { paypal: PaypalNs }).paypal);
  s.onerror = () => { sdkPromise = null; reject(new Error('sdk')); };
  document.head.appendChild(s);
 });
 return sdkPromise;
}

export interface PaypalButtonProps { planId: PlanId; onPaid?: () => void }

export function PaypalButton({ planId, onPaid }: PaypalButtonProps) {
 const ref = useRef<HTMLDivElement>(null);
 const client = useQueryClient();
 const [signedIn, setSignedIn] = useState<boolean | null>(null);
 const config = useQuery({ queryKey: ['paypal-config'], queryFn: () => getPaypalConfig(), staleTime: Infinity });
 useEffect(() => { supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session)); }, []);

 useEffect(() => {
  const clientId = config.data?.clientId;
  if (!signedIn || !clientId || !ref.current) return;
  let buttons: ReturnType<PaypalNs['Buttons']> | null = null; let cancelled = false;
  loadSdk(clientId).then(paypal => {
   if (cancelled || !ref.current) return;
   buttons = paypal.Buttons({
    style: { layout: 'horizontal', color: 'gold', shape: 'rect', label: 'pay', tagline: false, height: 45 },
    createOrder: async () => (await createPaypalOrder({ data: { planId: planId as 'mensualidad' } })).orderId,
    onApprove: async ({ orderID }: { orderID: string }) => {
     try { await capturePaypalOrder({ data: { orderId: orderID } }); await client.invalidateQueries({ queryKey: ['member-profile'] }); toast.success('¡Pago completado! Tu membresía ya está activa.'); onPaid?.(); }
     catch (e) { toast.error(e instanceof Error ? e.message : 'No pudimos confirmar tu pago.'); }
    },
    onError: () => toast.error('PayPal no pudo procesar el pago. Inténtalo de nuevo.'),
   });
   ref.current.innerHTML = '';
   buttons.render(ref.current).catch(() => {});
  }).catch(() => toast.error('No pudimos cargar PayPal.'));
  return () => { cancelled = true; buttons?.close(); };
 }, [signedIn, config.data?.clientId, planId, client, onPaid]);

 if (signedIn === false) return <Button asChild variant="sport" className="w-full"><Link to="/auth">INICIA SESIÓN PARA PAGAR</Link></Button>;
 if (config.isSuccess && !config.data.clientId) return <p className="paypal-pending">Pago con PayPal disponible muy pronto.</p>;
 return <div ref={ref} className="paypal-slot" aria-label="Pagar con PayPal" />;
}
