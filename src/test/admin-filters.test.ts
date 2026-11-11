import { describe, it, expect } from 'vitest';
import { matchesSmart, toCsv, type SmartFilter } from '@/lib/admin-filters';

const base: SmartFilter = { status: [], planIncludes: null, minDaysOverdue: null, maxDaysUntil: null, summary: '' };
describe('filtro inteligente', () => {
 it('vencidos hace más de 15 días excluye 15 e incluye 16', () => {
  const f = { ...base, minDaysOverdue: 15 };
  expect(matchesSmart({ membership: 'Mensualidad', days: -15, account_active: true }, f)).toBe(false);
  expect(matchesSmart({ membership: 'Mensualidad', days: -16, account_active: true }, f)).toBe(true);
 });
 it('por vencer abarca hasta 4 días', () => {
  const f = { ...base, status: ['por-vencer' as const] };
  expect(matchesSmart({ membership: 'X', days: 4, account_active: true }, f)).toBe(true);
  expect(matchesSmart({ membership: 'X', days: 5, account_active: true }, f)).toBe(false);
 });
 it('una cuenta desactivada no cuenta como activa', () => {
  expect(matchesSmart({ membership: 'X', days: 10, account_active: false }, { ...base, status: ['activos'] })).toBe(false);
 });
});
describe('csv', () => {
 it('escapa comas y comillas', () => {
  expect(toCsv(['a'], [['x,"y"']])).toBe('\uFEFFa\r\n"x,""y"""');
 });
});
describe('csv teléfono', () => {
 it('incluye la columna Teléfono', () => expect(toCsv(['Nombre', 'Teléfono'], [['Ana', '55 1234']])).toContain('Teléfono\r\nAna,55 1234'));
});

import { monthRange as mr, recentMonths as rm } from '@/lib/admin-filters';
describe('historial por mes', () => {
 it('noviembre 2026 empieza el 1 a medianoche de CDMX', () => {
  expect(mr('2026-11')).toEqual({ start: '2026-11-01T06:00:00.000Z', end: '2026-12-01T06:00:00.000Z' });
 });
 it('el 1 de dic a las 3am UTC todavía es noviembre en CDMX', () => {
  expect(rm(new Date('2026-12-01T03:00:00Z'), 2)).toEqual(['2026-11', '2026-10']);
 });
});
