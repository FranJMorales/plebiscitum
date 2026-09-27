import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Nav() {
  const { session, salir } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-electric-blue flex items-center justify-center font-black">
            P
          </div>
          <span className="font-bold text-lg">Plebiscitum</span>
        </Link>
        <ul className="hidden md:flex gap-8 text-sm text-smoke-grey/50 font-medium items-center">
          <li>
            <Link to="/iniciativas" className="hover:text-turquoise transition-colors">
              Iniciativas
            </Link>
          </li>
          <li>
            <a href="/#funciones" className="hover:text-turquoise transition-colors">
              Funciones
            </a>
          </li>
          <li>
            <a href="/#hoja-de-ruta" className="hover:text-turquoise transition-colors">
              Hoja de Ruta
            </a>
          </li>
          <li>
            <a href="/#preguntas-frecuentes" className="hover:text-turquoise transition-colors">
              FAQ
            </a>
          </li>
          {session && (
            <li>
              <button onClick={salir} className="hover:text-turquoise transition-colors">
                Salir
              </button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
