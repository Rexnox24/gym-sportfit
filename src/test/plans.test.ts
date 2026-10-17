import { describe, it, expect } from 'vitest';
import { plans, computeExpiry, onlinePlans } from '@/lib/plans';
describe('planes', () => {
 it('Promo Anual cuesta 3700', () => expect(plans.find(p => p.id === 'anual')?.price).toBe(3700));
 it('Promo Anual dura 12 meses', () => expect(computeExpiry('anual', null, new Date('2026-01-15T12:00:00Z')).slice(0, 7)).toBe('2027-01'));
 it('Visita y Anual no se compran en línea', () => { const ids = onlinePlans(new Date('2026-10-17')).map(p => p.id); expect(ids).not.toContain('visita'); expect(ids).not.toContain('anual'); });
});
