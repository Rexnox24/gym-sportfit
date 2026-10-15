import a1 from '@/assets/gym-1.jpg.asset.json';
import a2 from '@/assets/gym-2.jpg.asset.json';
import a3 from '@/assets/gym-3.jpg.asset.json';
import a4 from '@/assets/gym-4.jpg.asset.json';
import a5 from '@/assets/gym-5.jpg.asset.json';
import a6 from '@/assets/gym-6.jpg.asset.json';
import a7 from '@/assets/gym-7.jpg.asset.json';
import a8 from '@/assets/gym-8.jpg.asset.json';
import a9 from '@/assets/gym-9.jpg.asset.json';
import legPress from '@/assets/prensa-piernas.jpeg.asset.json';
import squat from '@/assets/sentadilla-guiada.jpeg.asset.json';
import smith from '@/assets/maquina-smith.jpeg.asset.json';
import calves from '@/assets/elevacion-talones.jpeg.asset.json';
import promotionPoster from '@/assets/promocion-fin-2026.jpeg.asset.json';
export const rates = [
 {name:'Mensualidad',price:350,period:'Un mes'},
 {name:'Semanal',price:150,period:'Una semana'},
 {name:'Visita',price:70,period:'Una visita'},
 {name:'Trimestral',price:780,period:'Tres meses'},
];
export const promotions = [{title:'Cierra este 2026 con todo',price:750,period:'Octubre · Noviembre · Diciembre 2026',image:promotionPoster.url,description:'Tres meses por $750. Consulta en el gimnasio las condiciones y la disponibilidad de esta promoción.'}];
export const openingHours = [
 {days:'Lunes a viernes',sessions:[{label:'Matutino',time:'6:00 a.m. – 1:00 p.m.'},{label:'Vespertino',time:'4:00 p.m. – 10:00 p.m.'}]},
 {days:'Sábados',sessions:[{label:'',time:'8:00 a.m. – 1:00 p.m.'}]},
];
export const amenities = ['Vestidores','Sanitario','Pesas con máquinas de peso integrado y peso libre','Cardio con bicicletas tipo spinning'];
export const photos = [a1,a2,a3,a4,a5,a6,a7,a8,a9].map(a=>a.url);
export const equipment = [
 {name:'Prensa de piernas',category:'Máquinas',image:legPress.url,description:'Plataforma de empuje para trabajar la fuerza de las piernas. Ajusta el asiento y la carga con ayuda del equipo del gimnasio.',muscles:'Cuádriceps · Glúteos'},
 {name:'Sentadilla guiada',category:'Máquinas',image:squat.url,description:'Estación con apoyo de espalda y hombros para realizar un movimiento guiado de piernas. Consulta al equipo para ajustar la posición y la carga.',muscles:'Piernas · Glúteos'},
 {name:'Máquina Smith',category:'Máquinas',image:smith.url,description:'Barra con recorrido guiado para ejercicios de fuerza. La posición, los seguros y la carga deben ajustarse al ejercicio.',muscles:'Tren superior · Tren inferior'},
 {name:'Elevación de talones',category:'Máquinas',image:calves.url,description:'Estación con apoyo sobre los hombros para trabajar los gemelos mediante elevaciones de talones. Utiliza un recorrido y una carga adecuados.',muscles:'Gemelos · Pantorrillas'},
 {name:'Peso libre',category:'Fuerza',image:photos[5],description:'Mancuernas para entrenar fuerza, trabajar de forma unilateral y desarrollar estabilidad. Permiten adaptar el recorrido a cada ejercicio.',muscles:'Tren superior · Tren inferior'},
 {name:'Máquinas de fuerza',category:'Máquinas',image:photos[2],description:'Equipamiento de fuerza con recorrido guiado. La configuración y la técnica deben ajustarse al ejercicio y a cada persona.',muscles:'Trabajo muscular específico'},
 {name:'Zona de entrenamiento',category:'Fuerza',image:photos[3],description:'Bancos y estaciones para combinar ejercicios de fuerza. Consulta al equipo del gimnasio para elegir la estación y ajustar su posición.',muscles:'Entrenamiento de cuerpo completo'},
 {name:'Estaciones de poleas',category:'Máquinas',image:photos[6],description:'Las poleas permiten trabajar con resistencia a lo largo del recorrido y combinar distintos ángulos de tracción.',muscles:'Espalda · Brazos · Hombros'},
 {name:'Área de bancos',category:'Fuerza',image:photos[7],description:'Bancos de apoyo para ejercicios de fuerza. Ajusta la posición y utiliza una carga adecuada a tu experiencia.',muscles:'Pecho · Hombros · Brazos'},
 {name:'El espacio Sportfit',category:'Instalaciones',image:photos[8],description:'Conoce las distintas estaciones y el ambiente real de Gym Sportfit en esta vista de nuestras instalaciones.',muscles:'Instalaciones'}
];
export function pageHead(title:string,description:string){return {meta:[{title:`${title} | Gym Sportfit`},{name:'description',content:description},{property:'og:title',content:`${title} | Gym Sportfit`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}
