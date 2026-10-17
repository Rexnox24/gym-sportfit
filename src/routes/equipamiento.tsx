import { createFileRoute } from '@tanstack/react-router';
import { EquipmentGallery } from '@/components/equipment-gallery';
import { pageHead } from '@/lib/gym-data';
export const Route=createFileRoute('/equipamiento')({staticData:{sitemap:true},head:()=>pageHead('Equipamiento','Explora las máquinas, el peso libre y las instalaciones reales de Gym Sportfit.'),component:Equipment});
function Equipment(){return <main className="shell"><div className="page-title"><div className="eyebrow">TU ZONA. TU RETO.</div><h1>EQUIPAMIENTO SPORTFIT.</h1><p>Fuerza en cada rincón. Conoce nuestras estaciones de entrenamiento.</p></div><section className="pb-20" aria-labelledby="zones-title"><h2 id="zones-title" className="sr-only">Zonas y máquinas del gimnasio</h2><EquipmentGallery/></section></main>;}
