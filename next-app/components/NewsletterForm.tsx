"use client";

export default function NewsletterForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
    input.value = "";
    // Toast nativo mientras no hay Supabase
    const toast = document.createElement("div");
    toast.textContent = "Gracias por suscribirte. Te avisamos con las novedades.";
    toast.style.cssText =
      "position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:0.9rem 1.6rem;border-radius:999px;font-size:0.9rem;z-index:9999;";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input type="email" placeholder="Ingresa tu email" aria-label="Ingresa tu email" required />
      <button type="submit">Suscribirme</button>
    </form>
  );
}
