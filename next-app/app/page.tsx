import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import NewsletterForm from "@/components/NewsletterForm";
import { getProductos } from "@/lib/getProductos";

// Siempre fresco: si tu tío agrega/edita productos, se reflejan al instante
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const DESTACADOS = await getProductos();
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="hero" id="inicio">
          <div className="hero-bg"></div>
          <div className="hero-inner hero-inner-simple">
            <div className="hero-copy hero-copy-simple">
              <h1>
                <span className="hero-word">Cada</span>{" "}
                <span className="hero-word">paso</span>{" "}
                <span className="hero-word">suma.</span>{" "}
                <span className="hero-word">Corre</span>{" "}
                <span className="hero-word">con</span>{" "}
                <span className="hero-word">actitud,</span>{" "}
                <span className="hero-word">entrena</span>{" "}
                <span className="hero-word">con</span>{" "}
                <span className="hero-word">estilo.</span>
              </h1>
              <p>
                Una tienda con energia deportiva, modelos seleccionados y una estetica directa:
                producto, actitud y accion.
              </p>
              <div className="hero-actions">
                <a href="/catalogo" className="btn btn-primary">
                  Ver catalogo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Productos destacados */}
        <section className="products-section" id="productos">
          <div className="section-heading products-heading">
            <div>
              <span className="eyebrow eyebrow-dark">Destacados</span>
              <h2>Modelos seleccionados.</h2>
            </div>
            <a href="/catalogo" className="btn btn-secondary">
              Ver catalogo completo
            </a>
          </div>
          <FeaturedCarousel products={DESTACADOS} />
        </section>

        {/* Newsletter */}
        <section className="newsletter-section" id="newsletter">
          <div className="newsletter-shell">
            <div className="newsletter-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 7l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <span className="eyebrow eyebrow-dark">Newsletter</span>
            <h2>Recibi novedades, ingresos y modelos destacados sobre De Luca Sport.</h2>
            <NewsletterForm />
          </div>
        </section>

        {/* Contacto */}
        <section className="contact-section" id="contacto">
          <div className="contact-layout">
            <div className="contact-copy">
              <span className="eyebrow eyebrow-light">Contacto</span>
              <h2>Estamos para ayudarte. Escribinos por WhatsApp o visitanos en Villa Bosch.</h2>
              <div className="contact-actions">
                <a
                  href="https://wa.me/5491165699188"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp"
                >
                  Hablar por WhatsApp
                </a>
                <a
                  href="https://instagram.com/delucasportok"
                  target="_blank"
                  rel="noreferrer"
                  className="ig-circle"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="contact-grid">
              <article className="contact-card">
                <span className="contact-label">Direccion</span>
                <h3>Santos Vega 5770</h3>
                <p>Villa Bosch, Buenos Aires</p>
              </article>
              <article className="contact-card">
                <span className="contact-label">Horarios</span>
                <h3>Lunes a Sabado</h3>
                <p>9:30 a 13:00 hs<br />16:30 a 20:00 hs</p>
              </article>
              <article className="contact-card">
                <span className="contact-label">WhatsApp</span>
                <h3>+54 9 11 6569-9188</h3>
                <p>Consultas, reserva y coordinacion</p>
              </article>
              <article className="contact-card">
                <span className="contact-label">Instagram</span>
                <h3>@delucasportok</h3>
                <p>Novedades, ingresos y contacto rapido</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartPanel />
    </>
  );
}

