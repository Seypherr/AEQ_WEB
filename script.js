/* ==========
   Utilitaires généraux
   ========== */

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(value) {
  return escapeHtml(value);
}

/* ==========
   Validation (Contact)
   ========== */

function setFieldError(field, message) {
  const id = field?.id;
  if (!id) return;

  const err =
    document.getElementById(`error-${id}`) ||
    document.getElementById(`error-${id.replace(/([A-Z])/g, "-$1").toLowerCase()}`);

  field.setAttribute("aria-invalid", "true");
  field.classList.add("is-invalid");
  if (err) err.textContent = message;
}

function clearFieldError(field) {
  const id = field?.id;
  if (!id) return;

  const err =
    document.getElementById(`error-${id}`) ||
    document.getElementById(`error-${id.replace(/([A-Z])/g, "-$1").toLowerCase()}`);

  field.removeAttribute("aria-invalid");
  field.classList.remove("is-invalid");
  if (err) err.textContent = "";
}

function isValidName(value) {
  const v = (value || "").trim();
  if (v.length < 2) return false;

  try {
    const re = /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u;
    return re.test(v);
  } catch {
    const reFallback = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    return reFallback.test(v);
  }
}

function parseBirthDate(value) {
  const v = (value || "").trim();
  const re = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const m = v.match(re);
  if (!m) return null;

  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);

  if (year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return null;
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d > today) return null;

  return d;
}

function isValidEmail(value) {
  const v = (value || "").trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v);
}

function isValidPhoneFR(value) {
  const v = (value || "").trim();
  if (!v) return false;

  const normalized = v.replace(/[\s.\-]/g, "");
  if (/^0\d{9}$/.test(normalized)) return true;
  if (/^\+33\d{9}$/.test(normalized)) return true;
  if (/^0033\d{9}$/.test(normalized)) return true;

  return false;
}

function getSelectedTimeSlot(form) {
  const checked = qs('input[name="timeSlot"]:checked', form);
  return checked ? checked.value : "";
}

/* ==========
   Toast & Modale
   ========== */

let lastFocusedEl = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.hidden = false;

  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}

function openModal() {
  const modal = document.getElementById("confirmModal");
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("closeModalBtn");
  if (!modal || !overlay || !closeBtn) return;

  lastFocusedEl = document.activeElement;

  overlay.hidden = false;
  modal.hidden = false;
  document.documentElement.classList.add("no-scroll");

  closeBtn.focus();

  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === "Tab") {
      const focusables = qsa(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        modal
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onOverlayClick(e) {
    if (e.target === overlay) closeModal();
  }

  function onCloseClick() {
    closeModal();
  }

  openModal._onKeyDown = onKeyDown;
  openModal._onOverlayClick = onOverlayClick;
  openModal._onCloseClick = onCloseClick;

  document.addEventListener("keydown", onKeyDown);
  overlay.addEventListener("click", onOverlayClick);
  closeBtn.addEventListener("click", onCloseClick);
}

function closeModal() {
  const modal = document.getElementById("confirmModal");
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("closeModalBtn");
  if (!modal || !overlay || !closeBtn) return;

  modal.hidden = true;
  overlay.hidden = true;

  document.documentElement.classList.remove("no-scroll");

  document.removeEventListener("keydown", openModal._onKeyDown);
  overlay.removeEventListener("click", openModal._onOverlayClick);
  closeBtn.removeEventListener("click", openModal._onCloseClick);

  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus();
  }
}

/* ==========
   Contact
   ========== */

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const lastName = document.getElementById("lastName");
  const firstName = document.getElementById("firstName");
  const birthDate = document.getElementById("birthDate");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const message = document.getElementById("message");
  const timeSlotError = document.getElementById("error-slot");

  [lastName, firstName, birthDate, email, phone, message].forEach((field) => {
    if (!field) return;
    field.addEventListener("input", () => clearFieldError(field));
  });

  const slotRadios = qsa('input[name="timeSlot"]', form);
  slotRadios.forEach((r) => {
    r.addEventListener("change", () => {
      if (timeSlotError) timeSlotError.textContent = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let ok = true;
    if (timeSlotError) timeSlotError.textContent = "";

    if (!lastName.value.trim()) {
      ok = false;
      setFieldError(lastName, "Le nom est requis.");
    } else if (!isValidName(lastName.value)) {
      ok = false;
      setFieldError(lastName, "Nom invalide (lettres, accents, espaces, tirets, apostrophes).");
    } else {
      clearFieldError(lastName);
    }

    if (!firstName.value.trim()) {
      ok = false;
      setFieldError(firstName, "Le prénom est requis.");
    } else if (!isValidName(firstName.value)) {
      ok = false;
      setFieldError(firstName, "Prénom invalide (lettres, accents, espaces, tirets, apostrophes).");
    } else {
      clearFieldError(firstName);
    }

    if (!birthDate.value.trim()) {
      ok = false;
      setFieldError(birthDate, "La date de naissance est requise.");
    } else if (!parseBirthDate(birthDate.value)) {
      ok = false;
      setFieldError(birthDate, "Date invalide. Format JJ/MM/AAAA (pas dans le futur).");
    } else {
      clearFieldError(birthDate);
    }

    if (!email.value.trim()) {
      ok = false;
      setFieldError(email, "L’email est requis.");
    } else if (!isValidEmail(email.value)) {
      ok = false;
      setFieldError(email, "Email invalide. Exemple : prenom.nom@domaine.com");
    } else {
      clearFieldError(email);
    }

    if (!phone.value.trim()) {
      ok = false;
      setFieldError(phone, "Le téléphone est requis.");
    } else if (!isValidPhoneFR(phone.value)) {
      ok = false;
      setFieldError(phone, "Téléphone invalide. Ex : 06 12 34 56 78 ou +33 6 12 34 56 78");
    } else {
      clearFieldError(phone);
    }

    const slot = getSelectedTimeSlot(form);
    if (!slot) {
      ok = false;
      if (timeSlotError) timeSlotError.textContent = "Choisis une plage horaire.";
    }

    const msg = message.value.trim();
    if (!msg) {
      ok = false;
      setFieldError(message, "Le message est requis.");
    } else if (msg.length < 10) {
      ok = false;
      setFieldError(message, "Le message doit faire au moins 10 caractères.");
    } else if (msg.length > 1000) {
      ok = false;
      setFieldError(message, "Le message ne doit pas dépasser 1000 caractères.");
    } else {
      clearFieldError(message);
    }

    if (!ok) {
      const firstInvalid = qs(".is-invalid", form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    showToast("Succès : ton message a bien été envoyé.");
    openModal();
    form.reset();
  });
}

/* ==========
   Produits (Collection) via data/products.json
   ========== */

async function initProductsCollection() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const woodSelect = document.getElementById("bois");
  const priceRange = document.getElementById("prixMax");
  const priceOut = document.getElementById("prixMaxValeur");
  const sortSelect = document.getElementById("tri");
  const filtersForm = document.getElementById("filtersForm");
  const resetBtn = document.getElementById("resetBtn");

  grid.setAttribute("aria-busy", "true");

  let products = [];
  try {
    const res = await fetch("data/products.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    products = await res.json();
  } catch (err) {
    console.error(err);
    grid.removeAttribute("aria-busy");
    grid.innerHTML = `
      <div class="card">
        <p><strong>Impossible de charger les produits.</strong></p>
        <p>Vérifie que <code>data/products.json</code> existe.</p>
      </div>
    `;
    return;
  }

  products.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

  if (filtersForm) {
    filtersForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFiltersAndSort();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (woodSelect) woodSelect.value = "";
      if (sortSelect) sortSelect.value = "populaire";
      if (priceRange) priceRange.value = "100";
      if (priceOut) priceOut.textContent = "100";
      applyFiltersAndSort();
    });
  }

  if (priceRange && priceOut) {
    priceOut.textContent = priceRange.value;
    priceRange.addEventListener("input", () => {
      priceOut.textContent = priceRange.value;
      applyFiltersAndSort();
    });
  }

  if (woodSelect) woodSelect.addEventListener("change", applyFiltersAndSort);
  if (sortSelect) sortSelect.addEventListener("change", applyFiltersAndSort);

  function applyFiltersAndSort() {
    const wood = woodSelect ? woodSelect.value : "";
    const maxPrice = priceRange ? Number(priceRange.value) : Number.POSITIVE_INFINITY;
    const sort = sortSelect ? sortSelect.value : "populaire";

    let list = products.slice();

    // Filtre essence / prix
    list = list.filter((p) => {
      const okWood = !wood || (p?.wood?.key ?? "") === wood;
      const okPrice = Number(p?.price ?? 0) <= maxPrice;
      return okWood && okPrice;
    });

    // Tri
    if (sort === "prix-asc") {
      list.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
    } else if (sort === "prix-desc") {
      list.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    } else {
      list.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
    }

    grid.innerHTML = list.map(renderProductCard).join("");
    grid.setAttribute("aria-label", `Liste de ${list.length} produit(s)`);
  }

  // Premier rendu
  applyFiltersAndSort();
  grid.removeAttribute("aria-busy");
}

function renderProductCard(p) {
  const woodLabel = p?.wood?.label ?? "";
  const name = p?.name ?? "";
  const desc = p?.description ?? "";
  const price = Number(p?.price ?? 0);
  const priceFr = price.toFixed(2).replace(".", ",");

  const img = p?.image ?? {};
  const imgSrc = img.src ?? "";
  const imgAlt = img.alt ?? "";
  const imgW = img.width ?? 800;
  const imgH = img.height ?? 600;

  const badges = Array.isArray(p?.badges) ? p.badges : [];
  const badgeHtml = badges.length ? `<span class="chip">${escapeHtml(badges[0])}</span>` : "";

  return `
    <article class="product-card" role="listitem">
      <div class="product-link">
        <div class="product-media">
          <img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(imgAlt)}" loading="lazy" width="${imgW}" height="${imgH}">
        </div>

        <div class="product-body">
          <p class="product-eyebrow">${escapeHtml(woodLabel)}</p>
          <h3 class="product-title">${escapeHtml(name)}</h3>
          <p class="product-desc">${escapeHtml(desc)}</p>

          <div class="product-meta">
            <span class="price" aria-label="Prix ${priceFr} euros">${priceFr} €</span>
            ${badgeHtml}
          </div>

          <a class="btn btn-outline product-cta"
             href="product.html?id=${encodeURIComponent(p?.id ?? "")}"
             aria-label="Voir le produit ${escapeAttr(woodLabel)} ${escapeAttr(name)}">
            Voir
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M5 12h12M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

/* ==========
   Page Produit (product.html?id=...)
   ========== */

async function initProductPage() {
  const root = document.getElementById("productRoot");
  if (!root) return;

  root.setAttribute("aria-busy", "true");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    root.removeAttribute("aria-busy");
    root.innerHTML = `
      <div class="card">
        <p><strong>Produit introuvable.</strong></p>
        <p>Aucun identifiant n’a été fourni dans l’URL.</p>
      </div>
    `;
    return;
  }

  let products = [];
  try {
    const res = await fetch("data/products.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    products = await res.json();
  } catch (e) {
    console.error(e);
    root.removeAttribute("aria-busy");
    root.innerHTML = `
      <div class="card">
        <p><strong>Impossible de charger les produits.</strong></p>
        <p>Vérifie que <code>data/products.json</code> existe.</p>
      </div>
    `;
    return;
  }

  const product = products.find((p) => p.id === id);
  if (!product) {
    root.removeAttribute("aria-busy");
    root.innerHTML = `
      <div class="card">
        <p><strong>Produit introuvable.</strong></p>
        <p>L’identifiant <code>${escapeHtml(id)}</code> ne correspond à aucun produit.</p>
      </div>
    `;
    return;
  }

  document.title = `${product.wood?.label ?? "Produit"} — ${product.name ?? ""} | AEQ`;

  const price = Number(product.price ?? 0);
  const priceFr = price.toFixed(2).replace(".", ",");
  const img = product.image ?? {};
  const details = product.details ?? {};
  const features = Array.isArray(details.features) ? details.features : [];
  const care = Array.isArray(details.care) ? details.care : [];
  const longDescription = (details.longDescription ?? "").trim();
  const origin = (details.origin ?? "").trim();

  const dims = details.dimensions ?? null;
  const widthMm = dims?.widthMm;
  const thicknessMm = dims?.thicknessMm;

    root.innerHTML = `
    <article class="card" aria-label="Détails du produit">
      <div style="display:grid; gap:1.25rem; grid-template-columns: 1.1fr 0.9fr; align-items:start;">
        <div>
          <img
            src="${escapeAttr(img.src ?? "")}"
            alt="${escapeAttr(img.alt ?? "")}"
            width="${img.width ?? 1200}"
            height="${img.height ?? 900}"
            style="width:100%; height:auto; border-radius: 16px;"
            loading="eager"
          >
        </div>

        <div>
          <p class="product-eyebrow">${escapeHtml(product.wood?.label ?? "")}</p>
          <h1 style="margin-top:0.25rem;">${escapeHtml(product.name ?? "")}</h1>

          <p style="margin-top:0.75rem;">${escapeHtml(product.description ?? "")}</p>

          <p class="price" style="margin-top:1rem; font-size: 1.25rem;">
            ${priceFr} €
          </p>

          ${
            Array.isArray(product.badges) && product.badges.length
              ? `<p style="margin-top:0.75rem;"><span class="chip">${escapeHtml(product.badges[0])}</span></p>`
              : ""
          }

          <p style="margin-top:1.25rem;">
            <a class="btn btn-outline" href="collection.html">Retour à la collection</a>
          </p>
        </div>
      </div>

      <hr style="margin:1.5rem 0; opacity:0.2;">

      <div style="display:grid; gap:1.25rem; grid-template-columns: 1fr 1fr;">
        <section aria-label="Description détaillée">
          <h2 style="margin-top:0;">Description détaillée</h2>
          <p>
            ${escapeHtml(
              longDescription ||
                "Ce modèle met en valeur les caractéristiques naturelles du bois et une finition durable, pensée pour un usage quotidien."
            )}
          </p>

          ${
            origin
              ? `<p style="margin-top:0.75rem;"><strong>Origine :</strong> ${escapeHtml(origin)}</p>`
              : ""
          }

          ${
            typeof widthMm === "number" || typeof thicknessMm === "number"
              ? `<p style="margin-top:0.75rem;"><strong>Dimensions :</strong>
                   ${typeof widthMm === "number" ? `${widthMm} mm de largeur` : ""}
                   ${
                     typeof widthMm === "number" && typeof thicknessMm === "number" ? " • " : ""
                   }
                   ${typeof thicknessMm === "number" ? `${thicknessMm} mm d’épaisseur` : ""}
                 </p>`
              : ""
          }
        </section>

        <section aria-label="Caractéristiques et entretien">
          <h2 style="margin-top:0;">Caractéristiques</h2>
          ${
            features.length
              ? `<ul>${features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>`
              : `<p>Bois sélectionné, finition soignée, conçu pour durer.</p>`
          }

          <h2 style="margin-top:1rem;">Entretien</h2>
          ${
            care.length
              ? `<ul>${care.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>`
              : `<p>Éviter l’eau et l’humidité, nettoyer au chiffon doux.</p>`
          }
        </section>
      </div>
    </article>
  `;

  root.removeAttribute("aria-busy");
} // <- fermeture de initProductPage()

/* ==========
   Boot
   ========== */

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initContactForm();
  initProductsCollection();
  initProductPage();
});
