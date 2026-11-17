document.addEventListener("DOMContentLoaded", function () {
  const search = document.getElementById("characterSearch");
  const worldFilter = document.getElementById("worldFilter");
  const grid = document.getElementById("charactersGrid");
  const count = document.getElementById("characterCount");
  const favorites = window.CoralineFavorites;

  if (!search || !worldFilter || !grid || !count || !favorites) {
    return;
  }

  const characters = favorites.characters;

  const status = document.createElement("p");
  status.id = "favoritesStatus";
  status.className = "favorites-status";
  status.setAttribute("role", "status");

  grid.before(status);

  const savedLink = document.createElement("a");
  savedLink.className = "favorites-link";
  savedLink.href = "world.html#favorites";

  count.after(savedLink);

  function updateSavedLink() {
    savedLink.textContent =
      "View favorites (" + favorites.getSelected().length + ") →";
  }

  function renderCharacters(list) {
    grid.replaceChildren();

    count.textContent =
      "Showing " + list.length + " of " + characters.length + " characters";

    if (list.length === 0) {
      const message = document.createElement("p");
      message.className = "characters-empty";
      message.textContent =
        "No characters found. Try another name or choose All Worlds.";

      grid.appendChild(message);
      return;
    }

    list.forEach(function (character) {
      grid.appendChild(favorites.createCard(character, false));
    });
  }

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    const selectedWorld = worldFilter.value;

    const filtered = characters.filter(function (character) {
      const matchesName = character.name.toLowerCase().includes(query);

      const matchesWorld =
        selectedWorld === "all" || character.world === selectedWorld;

      return matchesName && matchesWorld;
    });

    renderCharacters(filtered);
  }

  search.addEventListener("input", applyFilters);
  worldFilter.addEventListener("change", applyFilters);

  document.addEventListener("favorites:changed", updateSavedLink);

  updateSavedLink();
  applyFilters();
});