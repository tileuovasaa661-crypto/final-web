(function () {
  const storageKey = "coraline-theme";
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch (error) {
    // Переключатель работает даже при недоступном хранилище.
  }

  const initialTheme = savedTheme === "light" ? "light" : "dark";

  document.documentElement.dataset.theme = initialTheme;

  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".theme-toggle");

    function updateButtons(theme) {
      buttons.forEach(function (button) {
        button.textContent = theme === "dark" ? "☀ Light" : "☾ Dark";

        button.setAttribute(
          "aria-label",
          theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        );

        button.setAttribute(
          "aria-pressed",
          String(theme === "light")
        );
      });
    }

    updateButtons(initialTheme);

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const currentTheme = document.documentElement.dataset.theme;
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.dataset.theme = nextTheme;

        try {
          localStorage.setItem(storageKey, nextTheme);
        } catch (error) {
          // Текущая тема применяется без сохранения.
        }

        updateButtons(nextTheme);
      });
    });
  });
})();