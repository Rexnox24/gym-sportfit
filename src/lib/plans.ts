// Planes que se pueden pagar en línea. El servidor usa esta lista para fijar el importe.
export type PlanId = 'visita' | 'semanal' | 'mensualidad' | 'trimestral' | 'promo-fin-2026';

export interface PlanOption {
 id: PlanId;
 name: string;
 price: number;
 period: string;
 highlight?: string;
 features: string[];
 /** Último día en que se puede comprar (ISO, opcional). */
 availableUntil?: string;
}

export const plans: PlanOption[] = [
 { id: 'visita', name: 'Visita', price: 70, period: 'Una visita', features: ['Acceso por un día', 'Pesas y cardio'] },
 { id: 'semanal', name: 'Semanal', price: 150, period: '7 días', features: ['Acceso durante 7 días', 'Pesas y cardio', 'Vestidores y sanitario'] },
 { id: 'mensualidad', name: 'Mensualidad', price: 350, period: '1 mes', highlight: 'MÁS POPULAR', features: ['Acceso durante 1 mes', 'Pesas y cardio', 'Vestidores y sanitario'] },
 { id: 'trimestral', name: 'Trimestral', price: 780, period: '3 meses', features: ['Acceso durante 3 meses', 'Pesas y cardio', 'Vestidores y sanitario'] },
 { id: 'promo-fin-2026', name: 'Promo fin 2026', price: 750, period: 'Octubre · Noviembre · Diciembre', highlight: 'PROMOCIÓN', availableUntil: '2026-12-31T23:59:59-06:00', features: ['3 meses por $750', 'Ahorras $30 frente al trimestral', 'Pesas y cardio'] },
];

export function isPlanAvailable(plan: PlanOption, now = new Date()) {
 return !plan.availableUntil || now <= new Date(plan.availableUntil);
}

/** Calcula el nuevo vencimiento; si hay plan activo, se suma después del actual. */
export function computeExpiry(planId: PlanId, currentExpiry: string | null, now = new Date()) {
 const start = currentExpiry && new Date(currentExpiry) > now ? new Date(currentExpiry) : now;
 const d = new Date(start);
 if (planId === 'visita') { d.setHours(23, 59, 59, 0); if (d <= start) d.setDate(d.getDate() + 1); }
 else if (planId === 'semanal') d.setDate(d.getDate() + 7);
 else if (planId === 'mensualidad') d.setMonth(d.getMonth() + 1);
 else if (planId === 'promo-fin-2026') { const end = new Date('2026-12-31T23:59:59-06:00'); d.setMonth(d.getMonth() + 3); if (start < end && d < end) return end.toISOString(); }
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
