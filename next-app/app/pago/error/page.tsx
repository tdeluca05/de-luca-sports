import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PagoErrorPage() {
  return (
    <>
      <Header />
      <div className="pago-resultado">
        <div className="pago-icono pago-fail">✕</div>
        <h1>El pago no se completó</h1>
        <p>Hubo un problema con el pago o lo cancelaste. Podés intentarlo de nuevo.</p>
        <Link href="/checkout" className="btn btn-primary">Volver a intentar</Link>
      </div>
      <Footer />
    </>
  );
}
