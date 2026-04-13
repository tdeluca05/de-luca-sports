const WHATSAPP_NUMBER = "5491165699188";
const STORAGE_KEY = "deluca-cart";

let cart = [];
let toastTimeout = null;
const catalogState = {
  filter: "all",
  sport: "all",
  search: "",
  sort: "default",
};
let isProductCarouselAnimating = false;

function formatPrice(value) {
  return "$" + Number(value).toLocaleString("es-AR");
}

function generateCartId(productId, size) {
  return `${productId}-${size}`;
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    cart = stored ? JSON.parse(stored) : [];
  } catch (error) {
    cart = [];
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function getSelectedSize(card) {
  return card.querySelector(".size-btn.selected")?.dataset.size || null;
}

function markMissingSize(card) {
  const sizesGrid = card.querySelector(".sizes-grid");
  if (!sizesGrid) return;

  sizesGrid.classList.add("is-missing");
  window.setTimeout(() => sizesGrid.classList.remove("is-missing"), 1200);
}

function addToCart(productId, productName, price) {
  const card = document.querySelector(`[data-product-id="${productId}"]`);
  if (!card) return;

  const size = getSelectedSize(card);
  if (!size) {
    markMissingSize(card);
    showToast("Selecciona un talle antes de agregar.");
    return;
  }

  const cartId = generateCartId(productId, size);
  const existing = cart.find((item) => item.cartId === cartId);

  if (existing) {
    existing.qty += 1;
    showToast(`Sumaste otro ${productName} talle ${size}.`);
  } else {
    cart.push({ cartId, productId, name: productName, price: Number(price), size, qty: 1 });
    showToast(`${productName} talle ${size} agregado.`);
  }

  const btn = card.querySelector("[data-action='add-to-cart']");
  if (btn instanceof HTMLButtonElement) {
    btn.textContent = "¡Agregado!";
    btn.disabled = true;
    window.setTimeout(() => {
      btn.textContent = "Agregar al carrito";
      btn.disabled = false;
    }, 1400);
  }

  persistAndRender();
}

function removeFromCart(cartId) {
  cart = cart.filter((item) => item.cartId !== cartId);
  persistAndRender();
}

function clearCart() {
  cart = [];
  persistAndRender();
  showToast("Se vacio el carrito.");
}

function changeQty(cartId, delta) {
  const item = cart.find((entry) => entry.cartId === cartId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(cartId);
    return;
  }

  persistAndRender();
}

function getCartCount() {
  return cart.reduce((accumulator, item) => accumulator + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((accumulator, item) => accumulator + item.qty * item.price, 0);
}

function updateCartCounter() {
  const count = getCartCount();
  const counter = document.getElementById("cart-count");
  if (!counter) return;

  counter.textContent = count;
  counter.classList.toggle("hidden", count === 0);
}

function renderCart() {
  const itemsContainer = document.getElementById("cart-items");
  const subtotal = document.getElementById("cart-subtotal");
  const empty = document.getElementById("cart-empty");
  const successBox = document.getElementById("checkout-success");
  const checkoutForm = document.getElementById("checkout-form");
  const startCheckoutButton = document.getElementById("start-checkout-btn");
  const clearCartButton = document.getElementById("clear-cart-btn");
  if (!itemsContainer || !subtotal) return;

  // Eliminar solo los articulos anteriores, sin tocar cart-empty
  itemsContainer.querySelectorAll(".cart-item").forEach((el) => el.remove());

  if (cart.length === 0) {
    empty?.classList.remove("hidden");
    subtotal.textContent = formatPrice(0);
    checkoutForm?.classList.add("hidden");
    startCheckoutButton?.classList.add("hidden");
    clearCartButton?.classList.add("hidden");
    return;
  }

  empty?.classList.add("hidden");
  successBox?.classList.add("hidden");
  startCheckoutButton?.classList.remove("hidden");
  clearCartButton?.classList.remove("hidden");

  cart.forEach((item) => {
    const article = document.createElement("article");
    article.className = "cart-item";
    article.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">Talle ${item.size}</div>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" type="button" data-cart-action="decrease" data-cart-id="${item.cartId}">-</button>
          <span class="qty-number">${item.qty}</span>
          <button class="qty-btn" type="button" data-cart-action="increase" data-cart-id="${item.cartId}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" type="button" data-cart-action="remove" data-cart-id="${item.cartId}" aria-label="Eliminar producto">&times;</button>
    `;
    article.querySelectorAll("[data-cart-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const cartId = button.getAttribute("data-cart-id");
        const cartAction = button.getAttribute("data-cart-action");
        if (!cartId || !cartAction) return;
        if (cartAction === "increase") changeQty(cartId, 1);
        if (cartAction === "decrease") changeQty(cartId, -1);
        if (cartAction === "remove") removeFromCart(cartId);
      });
    });
    itemsContainer.appendChild(article);
  });

  subtotal.textContent = formatPrice(getCartTotal());
}

function persistAndRender() {
  saveCart();
  renderCart();
  updateCartCounter();
}

function openCart() {
  document.getElementById("cart-overlay")?.classList.add("open");
  document.getElementById("cart-panel")?.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  document.getElementById("cart-overlay")?.classList.remove("open");
  document.getElementById("cart-panel")?.classList.remove("open");
  document.body.classList.remove("cart-open");
}

function buildWhatsAppMessage(formData) {
  const deliveryLabels = { retiro: "Retiro en el local", envio: "Envio a domicilio" };
  const paymentLabels = { tarjeta: "Tarjeta", transferencia: "Transferencia", efectivo_local: "Efectivo en el local" };

  const lines = [
    "*Nuevo pedido — De Luca Sport*",
    "",
    `Nombre: ${formData.name}`,
    `Telefono: ${formData.phone}`,
    `Email: ${formData.email}`,
    "",
    "*Productos:*",
    ...cart.map((item) => `• ${item.name} — Talle ${item.size} x${item.qty}  (${formatPrice(item.price * item.qty)})`),
    "",
    `*Total: ${formatPrice(getCartTotal())}*`,
    "",
    `Entrega: ${deliveryLabels[formData.delivery] || formData.delivery}`,
  ];

  if (formData.delivery === "envio" && formData.address) {
    lines.push(`Direccion: ${formData.address}`);
  }

  lines.push(`Pago: ${paymentLabels[formData.payment] || formData.payment}`);

  if (formData.payment === "transferencia" && formData.paymentDetails?.reference) {
    lines.push(`Referencia de transferencia: ${formData.paymentDetails.reference}`);
  }

  return encodeURIComponent(lines.join("\n"));
}

function completeCheckout(formData) {
  const successBox = document.getElementById("checkout-success");
  const form = document.getElementById("checkout-form");
  const startCheckoutButton = document.getElementById("start-checkout-btn");
  const itemsContainer = document.getElementById("cart-items");
  const submitBtn = document.getElementById("checkout-submit");

  if (cart.length === 0) {
    showToast("El carrito esta vacio.");
    return;
  }

  const message = buildWhatsAppMessage(formData);

  localStorage.setItem("deluca-last-order", JSON.stringify({
    customer: formData,
    items: cart,
    total: getCartTotal(),
    createdAt: new Date().toISOString(),
  }));

  if (submitBtn instanceof HTMLButtonElement) {
    submitBtn.textContent = "Abriendo WhatsApp...";
    submitBtn.disabled = true;
  }

  window.setTimeout(() => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

    cart = [];
    persistAndRender();
    form?.reset();
    form?.classList.add("hidden");
    startCheckoutButton?.classList.add("hidden");
    itemsContainer?.classList.remove("hidden");
    successBox?.classList.remove("hidden");
    showToast("Pedido enviado por WhatsApp.");

    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.textContent = "Finalizar compra";
      submitBtn.disabled = false;
    }
  }, 400);
}

function initGalleries() {
  document.querySelectorAll(".product-gallery").forEach((gallery) => {
    const images = [...gallery.querySelectorAll("img")];
    const dots = [...gallery.querySelectorAll(".gallery-dot")];
    const prev = gallery.querySelector(".gallery-btn.prev");
    const next = gallery.querySelector(".gallery-btn.next");

    if (images.length <= 1) {
      prev?.classList.add("hidden");
      next?.classList.add("hidden");
      gallery.querySelector(".gallery-dots")?.classList.add("hidden");
      return;
    }

    let index = 0;

    function goTo(nextIndex) {
      images[index].classList.remove("active");
      dots[index]?.classList.remove("active");
      index = (nextIndex + images.length) % images.length;
      images[index].classList.add("active");
      dots[index]?.classList.add("active");
    }

    prev?.addEventListener("click", () => goTo(index - 1));
    next?.addEventListener("click", () => goTo(index + 1));
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => goTo(dotIndex));
    });
  });
}

function initSizeSelectors() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const buttons = card.querySelectorAll(".size-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((entry) => entry.classList.remove("selected"));
        button.classList.add("selected");
      });
    });
  });
}

function initProductOrder() {
  document.querySelectorAll(".product-card").forEach((card, index) => {
    if (!card.dataset.order) {
      card.dataset.order = String(index);
    }
  });
}

function initProductCarousel() {
  const grid = document.getElementById("products-grid");
  const prevButton = document.getElementById("products-prev");
  const nextButton = document.getElementById("products-next");
  if (!(grid instanceof HTMLElement) || !(prevButton instanceof HTMLButtonElement) || !(nextButton instanceof HTMLButtonElement)) {
    return;
  }

  function getVisibleCards() {
    return [...grid.querySelectorAll(".product-card:not(.is-hidden)")].filter(
      (card) => card instanceof HTMLElement
    );
  }

  function getStepWidth(cards) {
    if (!cards.length) return 0;
    const firstCard = cards[0];
    const cardWidth = firstCard.offsetWidth;
    const styles = window.getComputedStyle(grid);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return cardWidth + gap;
  }

  function scrollProducts(direction) {
    const cards = getVisibleCards();
    if (cards.length <= 1 || isProductCarouselAnimating) return;

    isProductCarouselAnimating = true;
    const stepWidth = getStepWidth(cards);
    if (!stepWidth) {
      isProductCarouselAnimating = false;
      return;
    }

    if (direction > 0) {
      grid.classList.add("is-sliding");
      grid.style.transform = `translateX(-${stepWidth}px)`;

      window.setTimeout(() => {
        if (direction > 0) {
          grid.appendChild(cards[0]);
        }
        grid.classList.add("is-reordering");
        grid.classList.remove("is-sliding");
        grid.style.transform = "translateX(0)";
        void grid.offsetWidth;
        grid.classList.remove("is-reordering");
        isProductCarouselAnimating = false;
      }, 320);
      return;
    }

    grid.classList.add("is-reordering");
    grid.insertBefore(cards[cards.length - 1], cards[0]);
    grid.style.transform = `translateX(-${stepWidth}px)`;
    void grid.offsetWidth;
    grid.classList.remove("is-reordering");
    grid.classList.add("is-sliding");
    grid.style.transform = "translateX(0)";

    window.setTimeout(() => {
      grid.classList.remove("is-sliding");
      isProductCarouselAnimating = false;
    }, 320);
  }

  prevButton.addEventListener("click", () => scrollProducts(-1));
  nextButton.addEventListener("click", () => scrollProducts(1));
}

function updateResultsCount() {
  const visibleProducts = [...document.querySelectorAll(".product-card")].filter(
    (card) => !card.classList.contains("is-hidden")
  ).length;
  const counter = document.getElementById("results-count");
  if (!counter) return;

  counter.textContent = `Mostrando ${visibleProducts} producto${visibleProducts === 1 ? "" : "s"}`;
}

function applyCatalogFilters() {
  const grid = document.getElementById("products-grid");
  const cards = [...document.querySelectorAll(".product-card")];
  if (!grid || !cards.length) return;

  cards.forEach((card) => {
    const matchesBrand = catalogState.filter === "all" || card.dataset.brand === catalogState.filter;
    const matchesSport = catalogState.sport === "all" || card.dataset.sport === catalogState.sport;
    const searchTarget = `${card.dataset.search || ""} ${card.querySelector(".product-name")?.textContent || ""}`.toLowerCase();
    const matchesSearch = searchTarget.includes(catalogState.search);
    card.classList.toggle("is-hidden", !(matchesBrand && matchesSport && matchesSearch));
  });

  const visibleCards = cards.filter((card) => !card.classList.contains("is-hidden"));
  const sortedCards = [...visibleCards].sort((firstCard, secondCard) => {
    const firstName = firstCard.querySelector(".product-name")?.textContent.trim() || "";
    const secondName = secondCard.querySelector(".product-name")?.textContent.trim() || "";
    const firstPrice = Number(
      (firstCard.querySelector(".product-price")?.textContent || "0").replace(/[^\d]/g, "")
    );
    const secondPrice = Number(
      (secondCard.querySelector(".product-price")?.textContent || "0").replace(/[^\d]/g, "")
    );

    if (catalogState.sort === "price-asc") return firstPrice - secondPrice;
    if (catalogState.sort === "price-desc") return secondPrice - firstPrice;
    if (catalogState.sort === "name-asc") return firstName.localeCompare(secondName, "es");
    return 0;
  });

  if (catalogState.sort === "default") {
    [...visibleCards]
      .sort((firstCard, secondCard) => Number(firstCard.dataset.order) - Number(secondCard.dataset.order))
      .forEach((card) => grid.appendChild(card));
  } else {
    sortedCards.forEach((card) => grid.appendChild(card));
  }

  updateResultsCount();
}

function initFilters() {
  const chips = document.querySelectorAll(".filter-chip");
  const sportSelect = document.getElementById("product-sport");
  const searchInput = document.getElementById("product-search");
  const sortSelect = document.getElementById("product-sort");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      catalogState.filter = chip.dataset.filter || "all";
      chips.forEach((entry) => entry.classList.remove("active"));
      chip.classList.add("active");
      applyCatalogFilters();
    });
  });

  sportSelect?.addEventListener("change", () => {
    catalogState.sport = sportSelect.value;
    applyCatalogFilters();
  });

  searchInput?.addEventListener("input", () => {
    catalogState.search = searchInput.value.trim().toLowerCase();
    applyCatalogFilters();
  });

  sortSelect?.addEventListener("change", () => {
    catalogState.sort = sortSelect.value;
    applyCatalogFilters();
  });
}

function initNavigation() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("main-nav");
  const navLinks = nav ? [...nav.querySelectorAll("a")] : [];
  const sections = [...document.querySelectorAll("main section[id]")];

  hamburger?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(Boolean(open)));
    document.body.classList.toggle("menu-open", Boolean(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      hamburger?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node) || !nav || !hamburger) return;
    if (!nav.contains(target) && !hamburger.contains(target)) {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });

  window.addEventListener("scroll", () => {
    const threshold = window.scrollY + 140;
    let currentId = sections[0]?.id || "inicio";

    sections.forEach((section) => {
      if (threshold >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  });
}

function initAddToCartButtons() {
  document.querySelectorAll("[data-action='add-to-cart']").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId, name, price } = button.dataset;
      if (!productId || !name || !price) return;
      addToCart(productId, name, Number(price));
    });
  });
}

function initCartControls() {
  document.getElementById("cart-btn")?.addEventListener("click", openCart);
  document.getElementById("cart-close")?.addEventListener("click", closeCart);
  document.getElementById("cart-overlay")?.addEventListener("click", closeCart);
  document.getElementById("clear-cart-btn")?.addEventListener("click", clearCart);
  document.getElementById("start-checkout-btn")?.addEventListener("click", () => {
    const cartItems = document.getElementById("cart-items");
    const checkoutForm = document.getElementById("checkout-form");
    const checkoutButton = document.getElementById("start-checkout-btn");
    const clearCartButton = document.getElementById("clear-cart-btn");
    const successBox = document.getElementById("checkout-success");
    const cartFooter = document.querySelector(".cart-footer");

    cartItems?.classList.add("hidden");
    checkoutForm?.classList.remove("hidden");
    checkoutButton?.classList.add("hidden");
    clearCartButton?.classList.add("hidden");
    successBox?.classList.add("hidden");

    if (cartFooter instanceof HTMLElement) {
      cartFooter.scrollTop = 0;
    }
  });
  document.getElementById("back-to-cart-btn")?.addEventListener("click", () => {
    const cartItems = document.getElementById("cart-items");
    const checkoutForm = document.getElementById("checkout-form");
    const checkoutButton = document.getElementById("start-checkout-btn");
    const clearCartButton = document.getElementById("clear-cart-btn");
    const successBox = document.getElementById("checkout-success");
    const cartFooter = document.querySelector(".cart-footer");

    cartItems?.classList.remove("hidden");
    checkoutForm?.classList.add("hidden");
    checkoutButton?.classList.remove("hidden");
    if (cart.length > 0) {
      clearCartButton?.classList.remove("hidden");
    }
    successBox?.classList.add("hidden");

    if (cartFooter instanceof HTMLElement) {
      cartFooter.scrollTop = 0;
    }
  });
  document.getElementById("checkout-delivery")?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;

    const addressInput = document.getElementById("checkout-address");
    const paymentSelect = document.getElementById("checkout-payment");
    if (!(addressInput instanceof HTMLInputElement)) return;

    if (target.value === "envio" && paymentSelect instanceof HTMLSelectElement && paymentSelect.value === "efectivo_local") {
      target.value = "retiro";
      showToast("El pago en efectivo solo esta disponible con retiro en el local.");
    }

    const requiresAddress = target.value === "envio";
    addressInput.required = requiresAddress;
    addressInput.placeholder = requiresAddress
      ? "Direccion de entrega"
      : "Direccion de entrega (si corresponde)";
  });
  document.getElementById("checkout-payment")?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;

    const deliverySelect = document.getElementById("checkout-delivery");
    const addressInput = document.getElementById("checkout-address");
    const paymentDetails = document.getElementById("payment-details");
    const cardFields = document.getElementById("payment-card-fields");
    const transferFields = document.getElementById("payment-transfer-fields");
    const cashFields = document.getElementById("payment-cash-fields");
    const cardName = document.getElementById("checkout-card-name");
    const cardNumber = document.getElementById("checkout-card-number");
    const cardExpiry = document.getElementById("checkout-card-expiry");
    const cardCvv = document.getElementById("checkout-card-cvv");
    const transferReference = document.getElementById("checkout-transfer-reference");

    paymentDetails?.classList.toggle("hidden", !target.value);
    cardFields?.classList.add("hidden");
    transferFields?.classList.add("hidden");
    cashFields?.classList.add("hidden");

    [cardName, cardNumber, cardExpiry, cardCvv, transferReference].forEach((field) => {
      if (field instanceof HTMLInputElement) {
        field.required = false;
      }
    });

    if (target.value === "tarjeta") {
      cardFields?.classList.remove("hidden");
      [cardName, cardNumber, cardExpiry, cardCvv].forEach((field) => {
        if (field instanceof HTMLInputElement) {
          field.required = true;
        }
      });
    }

    if (target.value === "transferencia") {
      transferFields?.classList.remove("hidden");
      if (transferReference instanceof HTMLInputElement) {
        transferReference.required = true;
      }
    }

    if (target.value === "efectivo_local") {
      if (deliverySelect instanceof HTMLSelectElement) {
        deliverySelect.value = "retiro";
      }
      if (addressInput instanceof HTMLInputElement) {
        addressInput.required = false;
        addressInput.value = "";
        addressInput.placeholder = "Direccion de entrega (si corresponde)";
      }
      cashFields?.classList.remove("hidden");
      showToast("En efectivo se paga solo al retirar en el local.");
    }

    const cartFooter = document.querySelector(".cart-footer");
    if (cartFooter instanceof HTMLElement) {
      cartFooter.scrollTop = 0;
    }
  });
  document.querySelectorAll("#checkout-form input, #checkout-form select").forEach((field) => {
    field.addEventListener("invalid", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;

      if (target.validity.valueMissing) {
        target.setCustomValidity("Por favor, completa este campo.");
      } else if (target.validity.typeMismatch && target.type === "email") {
        target.setCustomValidity("Por favor, ingresa un email valido.");
      } else {
        target.setCustomValidity("Por favor, revisa este campo.");
      }
    });

    field.addEventListener("input", (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
        target.setCustomValidity("");
      }
    });

    field.addEventListener("change", (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
        target.setCustomValidity("");
      }
    });
  });
  document.getElementById("checkout-form")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {
      name: document.getElementById("checkout-name")?.value.trim() || "",
      email: document.getElementById("checkout-email")?.value.trim() || "",
      phone: document.getElementById("checkout-phone")?.value.trim() || "",
      delivery: document.getElementById("checkout-delivery")?.value || "",
      payment: document.getElementById("checkout-payment")?.value || "",
      address: document.getElementById("checkout-address")?.value.trim() || "",
      paymentDetails:
        document.getElementById("checkout-payment")?.value === "tarjeta"
          ? {
              cardName: document.getElementById("checkout-card-name")?.value.trim() || "",
              cardNumber: document.getElementById("checkout-card-number")?.value.trim() || "",
              cardExpiry: document.getElementById("checkout-card-expiry")?.value.trim() || "",
              cardCvv: document.getElementById("checkout-card-cvv")?.value.trim() || "",
            }
          : document.getElementById("checkout-payment")?.value === "transferencia"
            ? {
                reference: document.getElementById("checkout-transfer-reference")?.value.trim() || "",
              }
            : {},
    };

    if (!formData.name || !formData.email || !formData.phone || !formData.delivery || !formData.payment) {
      showToast("Completa los datos para finalizar la compra.");
      return;
    }

    if (formData.delivery === "envio" && !formData.address) {
      showToast("Ingresa la direccion de entrega.");
      return;
    }

    if (formData.payment === "efectivo_local" && formData.delivery !== "retiro") {
      showToast("Si pagas en efectivo, el retiro debe ser en el local.");
      return;
    }

    completeCheckout(formData);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      document.getElementById("main-nav")?.classList.remove("open");
      document.getElementById("hamburger")?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  elements.forEach((element) => {
    if (!element.classList.contains("is-visible")) {
      observer.observe(element);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  initProductOrder();
  initGalleries();
  initSizeSelectors();
  initFilters();
  initProductCarousel();
  initNavigation();
  initAddToCartButtons();
  initCartControls();
  initScrollReveal();
  renderCart();
  updateCartCounter();
  updateResultsCount();
});
