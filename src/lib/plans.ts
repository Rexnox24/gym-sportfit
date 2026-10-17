// Planes que se pueden pagar en línea. El servidor usa esta lista para fijar el importe.
export type PlanId = 'cortesia' | 'visita' | 'semanal' | 'mensualidad' | 'trimestral' | 'promo-fin-2026' | 'anual';

export interface PlanOption {
 id: PlanId;
 name: string;
 price: number;
 period: string;
 highlight?: string;
 features: string[];
 /** Último día en que se puede comprar (ISO, opcional). */
 availableUntil?: string;
 /** false = solo el dueño lo asigna (no se compra en línea). */
 onlineCheckout: boolean;
 /** Solo el dueño la ve y asigna. */
 ownerOnly?: boolean;
}

export const COURTESY_PLAN = 'Cortesía / Staff';
export const plans: PlanOption[] = [
 { id: 'cortesia', name: COURTESY_PLAN, price: 0, period: 'Sin vencimiento', onlineCheckout: false, ownerOnly: true, features: ['Siempre al corriente', 'Solo la asigna el dueño'] },
 { id: 'visita', name: 'Visita', price: 70, period: 'Una visita', onlineCheckout: false, features: ['Acceso por un día', 'Pesas y cardio'] },
 { id: 'semanal', name: 'Semanal', price: 150, period: '7 días', onlineCheckout: true, features: ['Acceso durante 7 días', 'Pesas y cardio', 'Vestidores y sanitario'] },
 { id: 'mensualidad', name: 'Mensualidad', price: 350, period: '1 mes', highlight: 'MÁS POPULAR', onlineCheckout: true, features: ['Acceso durante 1 mes', 'Pesas y cardio', 'Vestidores y sanitario'] },
 { id: 'trimestral', name: 'Trimestral', price: 780, period: '3 meses', onlineCheckout: true, features: ['Acceso durante 3 meses', 'Pesas y cardio', 'Vestidores y sanitario'] },
 { id: 'promo-fin-2026', name: 'Promo fin 2026', price: 750, period: 'Octubre · Noviembre · Diciembre', highlight: 'PROMOCIÓN', availableUntil: '2026-12-31T23:59:59-06:00', onlineCheckout: true, features: ['3 meses por $750', 'Ahorras $30 frente al trimestral', 'Pesas y cardio'] },
 { id: 'anual', name: 'Promo Anual', price: 3700, period: '12 meses', highlight: 'MEJOR PRECIO', onlineCheckout: false, features: ['12 meses de acceso', 'Pesas, cardio y vestidores', 'El mejor costo por mes', 'Contrátala en recepción'] },
];

export const onlinePlans = (now = new Date()) => plans.filter(p => p.onlineCheckout && isPlanAvailable(p, now));

export function isPlanAvailable(plan: PlanOption, now = new Date()) {
 return !plan.availableUntil || now <= new Date(plan.availableUntil);
}

/** Calcula el nuevo vencimiento; si hay plan activo, se suma después del actual. */
export function computeExpiry(planId: PlanId, currentExpiry: string | null, now = new Date()): string | null {
 if (planId === 'cortesia') return null;
 const start = currentExpiry && new Date(currentExpiry) > now ? new Date(currentExpiry) : now;
 const d = new Date(start);
 if (planId === 'visita') { d.setHours(23, 59, 59, 0); if (d <= start) d.setDate(d.getDate() + 1); }
 else if (planId === 'semanal') d.setDate(d.getDate() + 7);
 else if (planId === 'mensualidad') d.setMonth(d.getMonth() + 1);
 else if (planId === 'promo-fin-2026') { const end = new Date('2026-12-31T23:59:59-06:00'); d.setMonth(d.getMonth() + 3); if (start < end && d < end) return end.toISOString(); }
 else if (planId === 'anual') d.setMonth(d.getMonth() + 12);
 else d.setMonth(d.getMonth() + 3);
 return d.toISOString();
}

/** Días completos que faltan para el vencimiento (0 = vence hoy, negativo = vencido). */
export function daysUntil(expiry: string | null, now = new Date()) {
 if (!expiry) return null;
 const a = new Date(now); a.setHours(0, 0, 0, 0);
 const b = new Date(expiry); b.setHours(0, 0, 0, 0);
 return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export const isCourtesy = (membership: string | null) => membership === COURTESY_PLAN;
/** Días para el filtro: cortesía cuenta siempre como vigente. */
export function effectiveDays(membership: string | null, expiry: string | null, now = new Date()) {
 return isCourtesy(membership) ? 9999 : daysUntil(expiry, now);
}
