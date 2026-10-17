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
