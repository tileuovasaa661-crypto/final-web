(function () {
  // Защита от повторного подключения файла.
  if (window.CoralineFavorites) return;

  const storageKey = "coraline-favorites";

  const characters = [
    {
      id: "coraline",
      name: "Coraline Jones",
      image: "images/коралина2.jpeg",
      description:
        "A curious, brave 11-year-old who discovers a hidden door.",
      details:
        "Her curiosity opens the door, but her courage helps her challenge the Other Mother and protect the people she loves.",
      world: "Real World"
    },
    {
      id: "wybie",
      name: "Wybie Lovat",
      image: "images/Wybie.jpeg",
      description:
        "Coraline's talkative neighbor and an unexpected ally.",
      details:
        "His grandmother owns the Pink Palace. His family history connects him to the mystery of the missing children.",
      world: "Real World"
    },
    {
      id: "other-mother",
      name: "The Other Mother",
      image: "images/өтірік мама.jpeg",
      description:
        "Warm and attentive at first, but hiding a terrifying secret.",
      details:
        "Also called the Beldam, she creates an attractive world to lure children into staying with her forever.",
      world: "Other World"
    },
    {
      id: "cat",
      name: "The Cat",
      image: "images/кэт2.jpeg",
      description:
        "A mysterious cat who walks freely between both worlds.",
      details:
        "He needs no other version of himself. His knowledge of both worlds makes him an important guide for Coraline.",
      world: "Both Worlds"
    },
    {
      id: "parents",
      name: "Mel & Charlie Jones",
      image: "images/отбасы.jpeg",
      description:
        "Coraline's loving parents, often distracted by their work.",
      details:
        "The Other World offers ideal versions of her parents, but Coraline learns to value her real family despite their flaws.",
      world: "Real World"
    },
    {
      id: "bobinsky",
      name: "Mr. Bobinsky",
      image: "images/бобинский2.jpeg",
      description:
        "An eccentric upstairs neighbor training a mouse circus.",
      details:
        "His strange warnings about the little door sound unlikely, but Coraline eventually discovers that they matter.",
      world: "Real World"
    },
    {
      id: "actresses",
      name: "Miss Spink & Miss Forcible",
      image: "images/сестры.jpeg",
      description:
        "Retired actresses who read Coraline's fortune in tea leaves.",
      details:
        "They give Coraline a seeing stone that helps her find what the Other Mother has hidden.",
      world: "Real World"
    },
    {
      id: "ghosts",
      name: "The Three Ghost Children",
      image: "images/призраки.jpeg",
      description:
        "Earlier victims of the Other Mother, trapped behind a mirror.",
      details:
        "To help free them, Coraline must recover their stolen eyes from the Other World's dangerous attractions.",
      world: "Other World"
    }
  ];

  function readSaved() {
    try {
      const data = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      if (!Array.isArray(data)) return [];

      return [...new Set(data)].filter(function (id) {
        return characters.some(function (character) {
          return character.id === id;
        });
      });
    } catch (error) {
      return [];
    }
  }

  let savedIds = readSaved();

  function has(id) {
    return savedIds.includes(id);
  }

  function getSelected() {
    return savedIds.map(function (id) {
      return characters.find(function (character) {
        return character.id === id;
      });
    });
  }

  function save(nextIds) {
    savedIds = nextIds;
    let persisted = true;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(savedIds)
      );
    } catch (error) {
      persisted = false;
    }

    document.dispatchEvent(
      new Event("favorites:changed")
    );

    return persisted;
  }

  function toggle(id) {
    if (!characters.some(function (item) {
      return item.id === id;
    })) {
      return false;
    }

    return save(
      has(id)
        ? savedIds.filter(function (savedId) {
            return savedId !== id;
          })
        : [...savedIds, id]
    );
  }

  function clear() {
    return save([]);
  }

  function announce(message) {
    const status = document.getElementById("favoritesStatus");

    if (status) {
      status.textContent = message;
    }
  }

  function updateButton(button) {
    const selected = has(button.dataset.characterId);

    button.textContent = selected
      ? "♥ Saved"
      : "♡ Add to favorites";

    button.setAttribute(
      "aria-pressed",
      String(selected)
    );
  }

  function createCard(character, removable) {
    const card = document.createElement("article");
    card.className = "char-card";

    const image = document.createElement("img");
    image.className = "char-card__img";
    image.src = character.image;
    image.alt = character.name;
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.className = "char-card__name";
    title.textContent = character.name;

    const description = document.createElement("p");
    description.className = "char-card__desc";
    description.textContent = character.description;

    const detailsId =
      (removable ? "saved-details-" : "details-") +
      character.id;

    const readMore = document.createElement("button");
    readMore.type = "button";
    readMore.className = "read-more-button";
    readMore.textContent = "Read more";
    readMore.setAttribute("aria-expanded", "false");
    readMore.setAttribute("aria-controls", detailsId);

    const details = document.createElement("p");
    details.id = detailsId;
    details.className = "character-details";
    details.textContent = character.details;
    details.style.display = "none";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-button";
    button.dataset.characterId = character.id;
    button.dataset.favoriteAction = removable
      ? "remove"
      : "toggle";

    if (removable) {
      button.textContent = "Remove";
      button.setAttribute(
        "aria-label",
        "Remove " + character.name + " from favorites"
      );
    } else {
      updateButton(button);
    }

    card.append(
      image,
      title,
      description,
      readMore,
      details,
      button
    );

    return card;
  }

  function renderFavorites() {
    const grid = document.getElementById("favoritesGrid");

    if (!grid) return;

    const selected = getSelected();
    grid.replaceChildren();

    selected.forEach(function (character) {
      grid.appendChild(createCard(character, true));
    });

    const count = document.getElementById("favoritesCount");
    const empty = document.getElementById("favoritesEmpty");
    const clearButton = document.getElementById("clearFavorites");

    if (count) {
      count.textContent =
        selected.length +
        (selected.length === 1
          ? " character saved"
          : " characters saved");
    }

    if (empty) {
      empty.hidden = selected.length > 0;
    }

    if (clearButton) {
      clearButton.hidden = selected.length === 0;
    }
  }

  function focusAfterRemoval(index) {
    const buttons = document.querySelectorAll(
      "#favoritesGrid [data-favorite-action='remove']"
    );

    const next = buttons[Math.min(index, buttons.length - 1)];

    if (next) {
      next.focus({ preventScroll: true });
    } else {
      const link = document.getElementById("favoritesHomeLink");

      if (link) {
        link.focus({ preventScroll: true });
      }
    }
  }

  // Один общий обработчик вместо обработчиков на каждой карточке.
  document.addEventListener("click", function (event) {
    const button = event.target.closest(
      "button[data-favorite-action]"
    );

    if (!button || button.disabled) return;

    const id = button.dataset.characterId;
    const character = characters.find(function (item) {
      return item.id === id;
    });

    if (!character) return;

    if (button.dataset.favoriteAction === "toggle") {
      const wasSaved = has(id);
      const persisted = toggle(id);

      announce(
        persisted
          ? character.name +
            (wasSaved
              ? " removed from favorites."
              : " added to favorites.")
          : "Selection changed, but browser storage is unavailable."
      );

      return;
    }

    const card = button.closest(".char-card");
    const removeButtons = Array.from(
      document.querySelectorAll(
        "#favoritesGrid [data-favorite-action='remove']"
      )
    );
    const index = removeButtons.indexOf(button);

    button.disabled = true;

    function finishRemoval() {
      const persisted = save(
        savedIds.filter(function (savedId) {
          return savedId !== id;
        })
      );

      announce(
        persisted
          ? character.name + " removed from favorites."
          : "Selection changed, but browser storage is unavailable."
      );

      focusAfterRemoval(index);
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (window.jQuery && !reducedMotion && card) {
      window.jQuery(card).fadeOut(200, finishRemoval);
    } else {
      finishRemoval();
    }
  });

  document.addEventListener("favorites:changed", function () {
    document
      .querySelectorAll(
        "#charactersGrid [data-favorite-action='toggle']"
      )
      .forEach(updateButton);

    renderFavorites();
  });

  window.CoralineFavorites = {
    characters,
    createCard,
    has,
    toggle,
    clear,
    getSelected
  };

  function init() {
    renderFavorites();

    const clearButton = document.getElementById("clearFavorites");

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        const persisted = clear();

        announce(
          persisted
            ? "All favorites cleared."
            : "Selection cleared, but browser storage is unavailable."
        );

        const link = document.getElementById("favoritesHomeLink");

        if (link) {
          link.focus({ preventScroll: true });
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }

  window.addEventListener("storage", function (event) {
    if (event.key === storageKey || event.key === null) {
      savedIds = readSaved();

      document.dispatchEvent(
        new Event("favorites:changed")
      );
    }
  });
})();