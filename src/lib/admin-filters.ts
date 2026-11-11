export type SmartStatus = 'activos' | 'por-vencer' | 'vencidos' | 'sin-pago' | 'inactivos';
export interface SmartFilter { status: SmartStatus[]; planIncludes: string | null; minDaysOverdue: number | null; maxDaysUntil: number | null; summary: string }
export interface FilterRow { membership: string | null; days: number | null; account_active: boolean }

/** Aplica el filtro interpretado por la IA. Los estados se combinan con «o». */
export function matchesSmart(r: FilterRow, f: SmartFilter) {
 if (f.status.length) {
  const ok = f.status.some((s) =>
   s === 'activos' ? r.account_active && r.days !== null && r.days >= 0
   : s === 'por-vencer' ? r.days !== null && r.days >= 0 && r.days <= 4
   : s === 'vencidos' ? r.days !== null && r.days < 0
   : s === 'sin-pago' ? r.days === null
   : !r.account_active);
  if (!ok) return false;
 }
 if (f.planIncludes && !(r.membership ?? '').toLowerCase().includes(f.planIncludes.toLowerCase())) return false;
 if (f.minDaysOverdue !== null && !(r.days !== null && -r.days > f.minDaysOverdue)) return false;
 if (f.maxDaysUntil !== null && !(r.days !== null && r.days >= 0 && r.days <= f.maxDaysUntil)) return false;
 return true;
}

const esc = (v: string) => (/[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export function toCsv(header: string[], rows: string[][]) {
 return '\uFEFF' + [header, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
}

/** Rango UTC de un mes en hora de Ciudad de México (UTC-6, sin horario de verano). month = 'YYYY-MM'. */
export function monthRange(month: string) {
 const [y, m] = month.split('-').map(Number) as [number, number];
 return { start: new Date(Date.UTC(y, m - 1, 1, 6)).toISOString(), end: new Date(Date.UTC(y, m, 1, 6)).toISOString() };
}
/** Últimos `count` meses (incluye el actual) en formato 'YYYY-MM', hora de Ciudad de México. */
export function recentMonths(now = new Date(), count = 12) {
 const mx = new Date(now.getTime() - 6 * 3600_000);
 return Array.from({ length: count }, (_, i) => { const d = new Date(Date.UTC(mx.getUTCFullYear(), mx.getUTCMonth() - i, 1)); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`; });
}
