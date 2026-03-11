document.addEventListener("DOMContentLoaded", function () {
  initAccordions();
});

function initAccordions() {
  const accordions = Array.from(document.querySelectorAll(".accordion"));

  if (!accordions.length) return;

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      const panel = this.nextElementSibling;
      if (!panel || !panel.classList.contains("panel")) return;

      const isOpen = this.classList.contains("active");

      // Close all others
      accordions.forEach((otherAccordion) => {
        const otherPanel = otherAccordion.nextElementSibling;
        if (!otherPanel || !otherPanel.classList.contains("panel")) return;

        otherAccordion.classList.remove("active");
        otherPanel.style.maxHeight = null;
      });

      if (!isOpen) {
        this.classList.add("active");
        openPanel(panel);

        // First pass: let the DOM react, then scroll
        window.setTimeout(() => {
          refreshOpenAccordion();
          scrollAccordionIntoView(this);
        }, 80);

        // Second pass: after the accordion animation is mostly done, correct again
        window.setTimeout(() => {
          refreshOpenAccordion();
          scrollAccordionIntoView(this, false);
        }, 420);
      }
    });
  });

  // Open first accordion by default
  const firstAccordion = accordions[0];
  const firstPanel = firstAccordion.nextElementSibling;

  if (firstPanel && firstPanel.classList.contains("panel")) {
    firstAccordion.classList.add("active");
    openPanel(firstPanel);

    window.setTimeout(() => refreshOpenAccordion(), 50);
    window.setTimeout(() => refreshOpenAccordion(), 200);
  }

  window.addEventListener("resize", function () {
    refreshOpenAccordion();
  });

  document.querySelectorAll(".panel img").forEach((img) => {
    img.addEventListener("load", function () {
      refreshOpenAccordion();
    });
  });
}

function openPanel(panel) {
  panel.style.maxHeight = panel.scrollHeight + "px";
}

function refreshOpenAccordion() {
  const activeAccordion = document.querySelector(".accordion.active");
  if (!activeAccordion) return;

  const activePanel = activeAccordion.nextElementSibling;
  if (!activePanel || !activePanel.classList.contains("panel")) return;

  activePanel.style.maxHeight = activePanel.scrollHeight + "px";
}

function scrollAccordionIntoView(accordion, smooth = true) {
  const header = document.getElementById("header");
  const headerHeight = header ? header.offsetHeight : 0;

  const extraOffset = 12;
  const topOffset = headerHeight + extraOffset;

  const accordionTop = accordion.getBoundingClientRect().top + window.scrollY;
  const targetY = Math.max(accordionTop - topOffset, 0);

  window.scrollTo({
    top: targetY,
    behavior: smooth ? "smooth" : "auto"
  });
}