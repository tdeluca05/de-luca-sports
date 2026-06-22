import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PagoPendientePage() {
  return (
    <>
      <Header />
      <div className="pago-resultado">
        <div className="pago-icono pago-pend">⏳</div>
        <h1>Pago pendiente</h1>
        <p>Tu pago está siendo procesado. Te avisaremos cuando se acredite.</p>
        <Link href="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
      <Footer />
    </>
  );
}
