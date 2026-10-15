import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead, promotions } from '@/lib/gym-data';

export const Route = createFileRoute('/promociones')({
 head: () => pageHead('Promociones', 'Conoce las promociones de Gym Sportfit: octubre, noviembre y diciembre de 2026 por $750.'),
 component: Promotions,
});

function Promotions() {
 return <main className="shell">
  <div className="page-title"><div className="eyebrow">MÁS MOTIVOS PARA ENTRENAR</div><h1>PROMOCIONES SPORTFIT.</h1><p>Tu siguiente reto empieza aquí.</p></div>
  <section className="promotions-list" aria-label="Promociones de Gym Sportfit">{promotions.map(promotion => <article className="promotion-feature" key={promotion.title}>
   <a className="promotion-poster" href={promotion.image} target="_blank" rel="noreferrer" aria-label="Ver cartel completo de la promoción"><img src={promotion.image} alt="Cierra este 2026 con todo: octubre, noviembre y diciembre por $750"/></a>
   <div className="promotion-copy"><span className="category">PROMOCIÓN · 2026</span><h2>{promotion.title.toUpperCase()}.</h2><p className="promotion-period">{promotion.period}</p><p className="promotion-price"><span>$</span>{promotion.price}</p><p className="section-text">{promotion.description}</p><Button asChild variant="outline" size="xl"><Link to="/planes">VER TARIFAS REGULARES <ArrowUpRight/></Link></Button></div>
  </article>)}</section>
 </main>;
}