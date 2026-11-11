// Productos de ejemplo. Precios en céntimos de sol (S/ 1.00 = 100).
export type SeedProduct = {
  name: string;
  description: string;
  category: string;
  priceCents: number;
  stock: number;
};

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: 'Laptop Pro 14" Ryzen 7',
    description:
      "Procesador Ryzen 7 de 8 núcleos, 16 GB de RAM y SSD de 512 GB. Pantalla 14\" 2.8K a 120 Hz, cuerpo de aluminio y hasta 12 horas de batería.",
    category: "Laptops",
    priceCents: 349900,
    stock: 8,
  },
  {
    name: 'Laptop Air 13" Core i5',
    description:
      "Ultraligera (1.2 kg) con Core i5, 8 GB de RAM y SSD de 256 GB. Ideal para estudiar y trabajar en movimiento.",
    category: "Laptops",
    priceCents: 229900,
    stock: 12,
  },
  {
    name: "Smartphone X12 128 GB",
    description:
      "Pantalla AMOLED de 6.5\" a 120 Hz, cámara principal de 50 MP con estabilización óptica, 8 GB de RAM y carga rápida de 67 W.",
    category: "Celulares",
    priceCents: 159900,
    stock: 20,
  },
  {
    name: "Smartphone Lite 64 GB",
    description:
      "Lo esencial bien hecho: pantalla de 6.4\", batería de 5000 mAh que dura dos días y doble cámara de 48 MP.",
    category: "Celulares",
    priceCents: 74900,
    stock: 30,
  },
  {
    name: "Audífonos inalámbricos ANC",
    description:
      "Cancelación activa de ruido, 30 horas de batería, modo ambiente y conexión simultánea a dos dispositivos.",
    category: "Audio",
    priceCents: 54900,
    stock: 25,
  },
  {
    name: "Parlante Bluetooth resistente al agua",
    description:
      "Sonido 360° con graves potentes, certificación IP67 y 15 horas de reproducción. Listo para la playa.",
    category: "Audio",
    priceCents: 22900,
    stock: 40,
  },
  {
    name: 'Monitor 27" QHD 165 Hz',
    description:
      "Panel IPS 2560×1440, 1 ms de respuesta, compatible con FreeSync y G-Sync. Colores precisos para jugar y diseñar.",
    category: "Monitores",
    priceCents: 119900,
    stock: 10,
  },
  {
    name: 'Monitor 24" Full HD IPS',
    description:
      "Panel IPS de bordes delgados, 75 Hz y modo de luz azul reducida. Ideal para home office.",
    category: "Monitores",
    priceCents: 59900,
    stock: 15,
  },
  {
    name: "Teclado mecánico RGB",
    description:
      "Switches mecánicos intercambiables, iluminación RGB por tecla, formato 75% y cable USB-C desmontable.",
    category: "Gaming",
    priceCents: 28900,
    stock: 35,
  },
  {
    name: "Mouse gamer inalámbrico",
    description:
      "Sensor de 26 000 DPI, solo 63 g de peso, 70 horas de batería y conexión inalámbrica de 1 ms.",
    category: "Gaming",
    priceCents: 19900,
    stock: 3,
  },
  {
    name: "Smartwatch deportivo con GPS",
    description:
      "GPS integrado, monitoreo de ritmo cardíaco y oxígeno, más de 100 modos deportivos y 10 días de batería.",
    category: "Accesorios",
    priceCents: 69900,
    stock: 18,
  },
  {
    name: "Cargador GaN 65 W USB-C",
    description:
      "Carga tu laptop, celular y audífonos a la vez con 3 puertos. Tecnología GaN: la mitad de tamaño que un cargador común.",
    category: "Accesorios",
    priceCents: 12900,
    stock: 60,
  },
];
