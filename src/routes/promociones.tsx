import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead, promotions } from '@/lib/gym-data';

export const Route = createFileRoute('/promociones')({
 head: () => pageHead('Promociones', 'Conoce las promociones de Gym Sportfit: octubre, noviembre y diciembre de 2026 por $750 y Promo Anual por $3,700.'),
 component: Promotions,
});

function Promotions() {
 return <main className="shell">
  <div className="page-title"><div className="eyebrow">MÁS MOTIVOS PARA ENTRENAR</div><h1>PROMOCIONES SPORTFIT.</h1><p>Tu siguiente reto empieza aquí.</p></div>
  <section className="promotions-list" aria-label="Promociones de Gym Sportfit">{promotions.map(promotion => <article className="promotion-feature" key={promotion.title}>
   {promotion.image ? <a className="promotion-poster" href={promotion.image} target="_blank" rel="noreferrer" aria-label="Ver cartel completo de la promoción"><img src={promotion.image} alt="Promoción de fin de año: octubre, noviembre y diciembre por $750"/></a> : <div className="promotion-poster promotion-poster-text"><span className="category">12 MESES</span><strong>$3,700</strong><span>MXN · CONTRÁTALA EN RECEPCIÓN</span></div>}
   <div className="promotion-copy"><span className="category">{promotion.image ? "PROMOCIÓN · 2026" : "PROMO ANUAL · SOLO EN RECEPCIÓN"}</span><h2>{promotion.title.toUpperCase()}.</h2><p className="promotion-period">{promotion.period}</p><p className="promotion-price"><span>$</span>{promotion.price.toLocaleString("es-MX")}</p><p className="section-text">{promotion.description}</p><Button asChild variant="outline" size="xl"><Link to="/planes">VER TARIFAS REGULARES <ArrowUpRight/></Link></Button></div>
  </article>)}</section>
 </main>;
}