function updateHeaderShrink() {
  const small = (document.body.scrollTop > 75 || document.documentElement.scrollTop > 75);
  document.body.classList.toggle("header-small", small);
}

function getHeaderComponentPath() {
  const path = window.location.pathname;

  // Root homepage
  if (path === "/" || path.endsWith("/index.html") && path.split("/").filter(Boolean).length === 1) {
    return "components/header-root.html";
  }

  // Everything else is treated as subpage
  return "../components/header-subpage.html";
}

function getCurrentPageKey() {
  const path = window.location.pathname.replace(/\/$/, "");

  if (path === "" || path === "/index.html") return "home";
  if (path.endsWith("/vita") || path.endsWith("/vita/index.html")) return "vita";
  if (path.endsWith("/projects") || path.endsWith("/projects/index.html")) return "projects";
  if (path.endsWith("/discussion") || path.endsWith("/discussion/index.html")) return "discussion";
  if (path.endsWith("/places") || path.endsWith("/places/index.html")) return "places";
  if (path.endsWith("/publications") || path.endsWith("/publications/index.html")) return "publications";

  return "";
}

function highlightCurrentNav() {
  const current = getCurrentPageKey();
  if (!current) return;

  document.querySelectorAll("[data-nav]").forEach(link => {
    if (link.getAttribute("data-nav") === current) {
      link.style.textDecoration = "overline";
    } else {
      link.style.textDecoration = "none";
    }
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener("click", function (event) {
    event.stopPropagation();
    const isOpen = document.body.classList.toggle("mobile-menu-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileMenu.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  document.addEventListener("click", function () {
    document.body.classList.remove("mobile-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 800) {
      document.body.classList.remove("mobile-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

async function loadSharedHeader() {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) return;

  const componentPath = getHeaderComponentPath();
  const response = await fetch(componentPath, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load header component: ${componentPath}`);
  }

  placeholder.innerHTML = await response.text();

  highlightCurrentNav();
  initMobileMenu();
  updateHeaderShrink();
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await loadSharedHeader();
  } catch (error) {
    console.error(error);
  }

  updateHeaderShrink();
});

window.addEventListener("scroll", updateHeaderShrink);