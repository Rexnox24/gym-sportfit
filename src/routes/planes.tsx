import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/gym-data';
export const Route=createFileRoute('/planes')({head:()=>pageHead('Planes y precios','Los planes y precios de Gym Sportfit se anunciarán próximamente.'),component:Plans});
function Plans(){return <main className="shell"><div className="page-title"><div className="eyebrow">INVIERTE EN TI</div><h1>ELIGE TU SIGUIENTE NIVEL.</h1><p>Planes y precios de Gym Sportfit.</p></div><section className="plan-pending"><span className="category">PLANES Y PRECIOS</span><h2>PRÓXIMAMENTE.</h2><p className="section-text mb-8">Estamos preparando la información de nuestras membresías. Los precios y beneficios estarán disponibles aquí una vez confirmados.</p><Button asChild variant="sport" size="xl"><Link to="/auth">CREAR MI CUENTA <ArrowUpRight/></Link></Button></section></main>;}
