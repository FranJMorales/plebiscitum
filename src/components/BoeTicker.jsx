import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

// Ticker inferior con los últimos títulos publicados en el BOE.
// Llama a /api/boe (boe.php en Hostinger) cada 10 minutos; si falla,
// muestra datos de ejemplo para que la sección nunca quede vacía.
export default function BoeTicker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch('/api/boe');
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              setItems(data.slice(0, 30));
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error fetching from /api/boe:', err);
      }

      const fallback = [
        {
          title: 'Real Decreto 420/2026, por el que se aprueba la convocatoria.',
          link: 'https://boe.es/diario_boe',
          date: new Date().toISOString(),
        },
        {
          title: 'Ley Orgánica 3/2026, de medidas urgentes para la participación ciudadana.',
          link: 'https://boe.es/diario_boe',
          date: new Date().toISOString(),
        },
      ];
      console.warn('Could not fetch real BOE data. Using fallback data.');
      setItems(fallback);
      setLoading(false);
    }

    cargar();
    const interval = setInterval(cargar, 600 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !items || items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-emerald-950/80 backdrop-blur-md border-t border-emerald-500/30 text-emerald-100 z-50 overflow-hidden text-sm">
      <Marquee gradient={false} speed={40}>
        {items.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-8 hover:text-white transition-colors"
          >
            {item.title}
          </a>
        ))}
      </Marquee>
    </div>
  );
}
