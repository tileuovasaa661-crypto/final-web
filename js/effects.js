(function () {
  if (window.coralineEffectsInitialized) return;
  window.coralineEffectsInitialized = true;

  function init() {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    document.addEventListener("click", function (event) {
      const button = event.target.closest(".read-more-button");

      if (!button) return;

      const details = document.getElementById(
        button.getAttribute("aria-controls")
      );

      if (!details) return;

      const willOpen =
        button.getAttribute("aria-expanded") !== "true";

      button.setAttribute(
        "aria-expanded",
        String(willOpen)
      );

      button.textContent = willOpen
        ? "Read less"
        : "Read more";

      if (window.jQuery) {
        const panel = window.jQuery(details);

        panel.stop(true, true);

        if (willOpen) {
          panel.slideDown(reducedMotion ? 0 : 250);
        } else {
          panel.slideUp(reducedMotion ? 0 : 250);
        }
      } else {
        details.style.display = willOpen ? "block" : "none";
      }
    });

    const backButton = document.getElementById("backToTop");

    if (!backButton) return;

    backButton.addEventListener("click", function () {
      const scroller = document.scrollingElement ||
        document.documentElement;

      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = "auto";

      function finish() {
        root.style.scrollBehavior = previousBehavior;

        const brand = document.querySelector(".navbar-brand");

        if (brand) {
          brand.focus({ preventScroll: true });
        }
      }

      if (window.jQuery) {
        window.jQuery(scroller)
          .stop(true, false)
          .animate(
            { scrollTop: 0 },
            reducedMotion ? 0 : 450,
            finish
          );
      } else {
        scroller.scrollTop = 0;
        finish();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();