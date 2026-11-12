import { LocationLine } from '@/components/location-map';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight, Check, Clock3, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BankTransfer } from '@/components/bank-transfer';
import { pageHead, openingHours, amenities } from '@/lib/gym-data';
import { plans, isPlanAvailable } from '@/lib/plans';

export const Route = createFileRoute('/planes')({
 staticData: { sitemap: true },
 head: () => pageHead('Planes y precios', 'Elige tu plan en Gym Sportfit y paga por transferencia BBVA o en recepción: semanal $150, mensualidad $350, trimestral $780, y Promo Anual $3,600.'),
 component: Plans,
});

function Plans() {
 const available = plans.filter(p => !p.ownerOnly && isPlanAvailable(p));
 return <main className="shell">
  <div className="page-title"><div className="eyebrow">INVIERTE EN TI</div><h1>ELIGE TU <span className="text-primary">SIGUIENTE NIVEL.</span></h1><p>Paga en línea y empieza a entrenar hoy mismo.</p><LocationLine/></div>
  <section className="rates-section" aria-label="Planes y precios">
   <div className="plans-grid">{available.map(plan => <article key={plan.id} className={'plan-card' + (plan.highlight ? ' is-featured' : '') + (plan.id === 'anual' || plan.id.startsWith('bf-') ? ' is-promo' : '')}>
    {plan.highlight && <span className="plan-badge">{plan.highlight}</span>}
    <span className="category">{plan.period.toUpperCase()}</span>
    <h2>{plan.name}</h2>
    <p className="plan-price"><span>$</span>{plan.price.toLocaleString('es-MX')}<small>MXN</small></p>
    <ul className="plan-features">{plan.features.map(f => <li key={f}><Check aria-hidden="true" />{f}</li>)}</ul>
    <div className="plan-pay">{plan.onlineCheckout ? <p className="plan-onsite">Paga por transferencia BBVA o en recepción</p> : <p className="plan-onsite">{plan.id === 'visita' ? 'Paga en efectivo en el gimnasio con el dueño o encargado' : 'Paga por transferencia BBVA o en efectivo'}</p>}</div>
   </article>)}</div>
   <BankTransfer />
   <div className="payment-strip"><p><Zap aria-hidden="true" />Transferencia BBVA o efectivo en recepción.</p><p><ShieldCheck aria-hidden="true" />Envía tu comprobante por WhatsApp y activamos tu membresía.</p><Button asChild variant="link"><Link to="/promociones">VER PROMOCIONES <ArrowUpRight /></Link></Button></div>
  </section>
  <section className="information-section" aria-labelledby="services-title"><div><div className="eyebrow">TU ESPACIO DE ENTRENAMIENTO</div><h2 id="services-title">TODO EN SPORTFIT.</h2></div><ul className="amenities-list">{amenities.map(item => <li key={item}>{item}</li>)}</ul></section>
  <section className="information-section" aria-labelledby="hours-title"><div><div className="eyebrow"><Clock3 aria-hidden="true" /> NUESTROS HORARIOS</div><h2 id="hours-title">ENCUENTRA TU MOMENTO.</h2></div><div className="hours-list">{openingHours.map(day => <div className="hours-day" key={day.days}><h3>{day.days}</h3>{day.sessions.map(session => <p key={session.time}>{session.label && <span>{session.label}</span>}<strong>{session.time}</strong></p>)}</div>)}</div></section>
 </main>;
}
