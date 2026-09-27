import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import BoeTicker from './components/BoeTicker';
import Hero from './components/Hero';
import Features from './components/Features';
import Roadmap from './components/Roadmap';
import FAQ from './components/FAQ';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import Cookies from './pages/Cookies';
import Legal from './pages/Legal';
import Iniciativas from './pages/Iniciativas';
import IniciativaDetalle from './pages/IniciativaDetalle';

function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <Roadmap />
      <FAQ />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/iniciativas" element={<Iniciativas />} />
        <Route path="/iniciativas/:id" element={<IniciativaDetalle />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
      <Footer />
      <BoeTicker />
    </AuthProvider>
  );
}
