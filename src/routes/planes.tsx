import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight, Banknote, CreditCard, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead, rates, openingHours, amenities } from '@/lib/gym-data';

export const Route = createFileRoute('/planes')({
 head: () => pageHead('Planes y precios', 'Consulta las tarifas de Gym Sportfit: mensualidad $350, semanal $150, visita $70 y trimestral $780, métodos de pago y horarios.'),
 component: Plans,
});

function Plans() {
 return <main className="shell">
  <div className="page-title"><div className="eyebrow">INVIERTE EN TI</div><h1>ELIGE TU SIGUIENTE NIVEL.</h1><p>Tu entrenamiento, a tu ritmo. Tarifas de Gym Sportfit.</p></div>
  <section className="rates-section" aria-label="Tarifas">
   <div className="rates-grid">{rates.map(rate => <article className="rate-card" key={rate.name}><span className="category">{rate.period}</span><h2>{rate.name}</h2><p className="rate-price"><span>$</span>{rate.price}</p></article>)}</div>
   <div className="rates-note"><p>Conoce también nuestras promociones.</p><Button asChild variant="link"><Link to="/promociones">VER PROMOCIONES <ArrowUpRight/></Link></Button></div>
  </section>
  <section className="information-section" aria-labelledby="payment-title"><div><div className="eyebrow">FORMAS DE PAGO</div><h2 id="payment-title">PAGA A TU MANERA.</h2></div><div className="payment-options"><p><Banknote aria-hidden="true"/>Efectivo</p><p><CreditCard aria-hidden="true"/>Transferencia a tarjeta</p><p className="section-text">Solicita el número de tarjeta directamente en el gimnasio para realizar tu transferencia.</p></div></section>
  <section className="information-section" aria-labelledby="services-title"><div><div className="eyebrow">TU ESPACIO DE ENTRENAMIENTO</div><h2 id="services-title">TODO EN SPORTFIT.</h2></div><ul className="amenities-list">{amenities.map(item => <li key={item}>{item}</li>)}</ul></section>
  <section className="information-section" aria-labelledby="hours-title"><div><div className="eyebrow"><Clock3 aria-hidden="true"/> NUESTROS HORARIOS</div><h2 id="hours-title">ENCUENTRA TU MOMENTO.</h2></div><div className="hours-list">{openingHours.map(day => <div className="hours-day" key={day.days}><h3>{day.days}</h3>{day.sessions.map(session => <p key={session.time}>{session.label && <span>{session.label}</span>}<strong>{session.time}</strong></p>)}</div>)}</div></section>
 </main>;
}