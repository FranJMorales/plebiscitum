import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-smoke-grey/50">
        <span>© {new Date().getFullYear()} Plebiscitum</span>
        <ul className="flex flex-wrap gap-6 font-medium">
          <li>
            <Link to="/privacidad" className="hover:text-turquoise transition-colors">
              Privacidad
            </Link>
          </li>
          <li>
            <Link to="/terminos" className="hover:text-turquoise transition-colors">
              Términos
            </Link>
          </li>
          <li>
            <Link to="/cookies" className="hover:text-turquoise transition-colors">
              Cookies
            </Link>
          </li>
          <li>
            <Link to="/legal" className="hover:text-turquoise transition-colors">
              Aviso Legal
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
