import { LocationLine } from '@/components/location-map';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead, activePromotions } from '@/lib/gym-data';

export const Route = createFileRoute('/promociones')({
 staticData: { sitemap: true },
 head: () => pageHead('Promociones', 'Conoce las promociones de Gym Sportfit: Buen Fin del 13 al 17 de noviembre (6 meses por $1,700 y anual a $2,900) y Promo Anual por $3,600.'),
 component: Promotions,
});

function Promotions() {
 return <main className="shell">
  <div className="page-title"><div className="eyebrow">MÁS MOTIVOS PARA ENTRENAR</div><h1>PROMOCIONES SPORTFIT.</h1><p>Tu siguiente reto empieza aquí.</p><LocationLine/></div>
  <section className="promotions-list" aria-label="Promociones de Gym Sportfit">{activePromotions().map(promotion => <article className="promotion-feature" key={promotion.title}>
   {promotion.image ? <a className="promotion-poster" href={promotion.image} target="_blank" rel="noreferrer" aria-label="Ver cartel completo de la promoción"><img src={promotion.image} alt={`Cartel ${promotion.title}: ${promotion.offers?.join(", ")??""}`}/></a> : <div className="promotion-poster promotion-poster-text"><span className="category">12 MESES</span><strong>$3,600</strong><span>MXN · CONTRÁTALA EN RECEPCIÓN</span></div>}
   <div className="promotion-copy"><span className="category">{promotion.image ? "PROMOCIÓN · BUEN FIN 2026" : "PROMO ANUAL · SOLO EN RECEPCIÓN"}</span><h2>{promotion.title.toUpperCase()}.</h2><p className="promotion-period">{promotion.period}</p>{promotion.offers ? <ul className="amenities-list my-6">{promotion.offers.map(o=><li key={o} className="text-primary font-display text-3xl font-extrabold uppercase">{o}</li>)}</ul> : <p className="promotion-price"><span>$</span>{promotion.price.toLocaleString("es-MX")}</p>}<p className="section-text">{promotion.description}</p><Button asChild variant="outline" size="xl"><Link to="/planes">VER TARIFAS REGULARES <ArrowUpRight/></Link></Button></div>
  </article>)}</section>
 </main>;
}