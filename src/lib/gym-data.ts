import a1 from '@/assets/gym-1.jpg.asset.json';
import a2 from '@/assets/gym-2.jpg.asset.json';
import a3 from '@/assets/gym-3.jpg.asset.json';
import a4 from '@/assets/gym-4.jpg.asset.json';
import a5 from '@/assets/gym-5.jpg.asset.json';
import a6 from '@/assets/gym-6.jpg.asset.json';
import a7 from '@/assets/gym-7.jpg.asset.json';
import a8 from '@/assets/gym-8.jpg.asset.json';
import a9 from '@/assets/gym-9.jpg.asset.json';
export const photos = [a1,a2,a3,a4,a5,a6,a7,a8,a9].map(a=>a.url);
export const equipment = [
 {name:'Peso libre',category:'Fuerza',image:photos[5],description:'Mancuernas para entrenar fuerza, trabajar de forma unilateral y desarrollar estabilidad. Permiten adaptar el recorrido a cada ejercicio.',muscles:'Tren superior · Tren inferior'},
 {name:'Máquinas de fuerza',category:'Máquinas',image:photos[2],description:'Equipamiento de fuerza con recorrido guiado. La configuración y la técnica deben ajustarse al ejercicio y a cada persona.',muscles:'Trabajo muscular específico'},
 {name:'Zona de entrenamiento',category:'Fuerza',image:photos[3],description:'Bancos y estaciones para combinar ejercicios de fuerza. Consulta al equipo del gimnasio para elegir la estación y ajustar su posición.',muscles:'Entrenamiento de cuerpo completo'},
 {name:'Estaciones de poleas',category:'Máquinas',image:photos[6],description:'Las poleas permiten trabajar con resistencia a lo largo del recorrido y combinar distintos ángulos de tracción.',muscles:'Espalda · Brazos · Hombros'},
 {name:'Área de bancos',category:'Fuerza',image:photos[7],description:'Bancos de apoyo para ejercicios de fuerza. Ajusta la posición y utiliza una carga adecuada a tu experiencia.',muscles:'Pecho · Hombros · Brazos'},
 {name:'El espacio Sportfit',category:'Instalaciones',image:photos[8],description:'Conoce las distintas estaciones y el ambiente real de Gym Sportfit en esta vista de nuestras instalaciones.',muscles:'Instalaciones'}
];
export function pageHead(title:string,description:string){return {meta:[{title:`${title} | Gym Sportfit`},{name:'description',content:description},{property:'og:title',content:`${title} | Gym Sportfit`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}
