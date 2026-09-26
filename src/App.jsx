import { Routes, Route } from 'react-router-dom';
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
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
      <Footer />
      <BoeTicker />
    </>
  );
}
