import { describe, it, expect } from 'vitest';
import { plans, computeExpiry, onlinePlans } from '@/lib/plans';
describe('planes', () => {
 it('Promo Anual cuesta 3600', () => expect(plans.find(p => p.id === 'anual')?.price).toBe(3600));
 it('Promo Anual dura 12 meses', () => expect(computeExpiry('anual', null, new Date('2026-01-15T12:00:00Z'))!.slice(0, 7)).toBe('2027-01'));
 it('Visita y Anual no se compran en línea', () => { const ids = onlinePlans(new Date('2026-10-17')).map(p => p.id); expect(ids).not.toContain('visita'); expect(ids).not.toContain('anual'); });
});
import { effectiveDays, COURTESY_PLAN } from '@/lib/plans';
describe('cortesía y visita', () => {
 it('Cortesía / Staff siempre al corriente sin fecha', () => { expect(effectiveDays(COURTESY_PLAN, null)).toBeGreaterThan(0); expect(computeExpiry('cortesia', null)).toBeNull(); });
 it('Cortesía no se compra en línea y es solo del dueño', () => expect(plans.find(p => p.id === 'cortesia')?.ownerOnly).toBe(true));
 it('Visita cuesta 70 y se paga en el gimnasio', () => { const v = plans.find(p => p.id === 'visita'); expect(v?.price).toBe(70); expect(v?.onlineCheckout).toBe(false); });
});

import { plusDays } from '@/lib/plans';
describe('sumar días de renovación', () => {
	it('si aún le quedan días, se suman al final de la vigencia', () => expect(plusDays('2026-10-20T12:00:00Z', 30, new Date('2026-10-17T12:00:00Z')).slice(0, 10)).toBe('2026-11-19'));
	it('si ya venció, se cuentan desde hoy', () => expect(plusDays('2026-10-01T12:00:00Z', 30, new Date('2026-10-17T12:00:00Z')).slice(0, 10)).toBe('2026-11-16'));
	it('sin vigencia, se cuentan desde hoy', () => expect(plusDays(null, 30, new Date('2026-10-17T12:00:00Z')).slice(0, 10)).toBe('2026-11-16'));
});

import { portalPlans } from '@/lib/plans';
import { authErrorMessage } from '@/lib/auth-messages';
describe('portal, tarjeta y registro', () => {
 it('la Promo Anual se puede elegir en el portal', () => expect(portalPlans(new Date('2026-10-17')).map(p => p.id)).toContain('anual'));
 it('contraseña débil da mensaje específico', () => expect(authErrorMessage({ code: 'weak_password', message: 'x' })).toContain('muy común'));
 it('correo repetido da mensaje específico', () => expect(authErrorMessage({ message: 'User already registered' })).toContain('ya está registrado'));
});
describe('promociones vigentes', () => {
 it('ya no existe la promo de fin de año', () => expect(plans.map(p => p.id)).not.toContain('promo-fin-2026'));
});

import { products as _products, computeExpiry as _ce, plans as _plans } from '@/lib/plans';
describe('productos y Buen Fin', () => {
 it('agua cuesta $10 y pre entreno $30', () => { expect(_products.map(p => p.price)).toEqual([10, 30]); });
 it('Buen Fin 6 meses cuesta $1,700 y anual $2,900', () => { expect(_plans.find(p => p.id === 'bf-6meses')?.price).toBe(1700); expect(_plans.find(p => p.id === 'bf-anual')?.price).toBe(2900); });
 it('Buen Fin 6 meses suma 6 meses', () => { const now = new Date('2026-11-14T12:00:00Z'); expect(new Date(_ce('bf-6meses', null, now)!).getMonth()).toBe(4); });
});
