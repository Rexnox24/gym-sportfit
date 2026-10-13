import { createFileRoute } from '@tanstack/react-router';
import { EquipmentGallery } from '@/components/equipment-gallery';
import { pageHead } from '@/lib/gym-data';
export const Route=createFileRoute('/equipamiento')({head:()=>pageHead('Equipamiento','Explora las máquinas, el peso libre y las instalaciones reales de Gym Sportfit.'),component:Equipment});
function Equipment(){return <main className="shell"><div className="page-title"><div className="eyebrow">TU ZONA. TU RETO.</div><h1>EQUIPAMIENTO SPORTFIT.</h1><p>Fuerza en cada rincón. Conoce nuestras estaciones de entrenamiento.</p></div><section className="pb-20"><EquipmentGallery/></section></main>;}
