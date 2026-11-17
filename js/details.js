(function () {
  function init() {
    const buttons = document.querySelectorAll("[data-color-stage]");
    const image = document.getElementById("colorScene");
    const video = document.getElementById("colorVideo");
    const caption = document.getElementById("colorCaption");
    const title = document.getElementById("colorStageTitle");
    const description = document.getElementById("colorStageDescription");
    const palette = document.getElementById("colorPalette");
    const status = document.getElementById("colorStatus");

    if (
      !buttons.length || !image || !video || !caption ||
      !title || !description || !palette || !status
    ) {
      return;
    }

    const stages = {
      real: {
        title: "Standing apart",
        type: "video",
        src: "media/real .mp4",
        alt: "Coraline in the Real World",
        caption:
          "A film clip used to explore the Real World's colors.",
        description:
          "Coraline's yellow raincoat and blue hair make her stand out. Against a subdued setting, her appearance can suggest energy, curiosity and a wish for change.",
        colors: [
          { name: "Raincoat yellow", value: "#E9BC35" },
          { name: "Hair blue", value: "#34528B" },
          { name: "Muted gray", value: "#777A78" },
          { name: "Dusty violet", value: "#70617C" }
        ]
      },

      other: {
        title: "An inviting illusion",
        type: "video",
        src: "media/other.mp4",
        alt: "The Other Mother in her welcoming appearance",
        caption:
          "The Other Mother's appearance illustrates the promise of a more attentive home.",
        description:
          "The Other World offers spectacle and attention. Richer colors can make its spaces seem inviting, encouraging the viewer to share Coraline's fascination before looking more closely.",
        colors: [
          { name: "Warm gold", value: "#DCA949" },
          { name: "Garden pink", value: "#C35E91" },
          { name: "Deep violet", value: "#67418B" },
          { name: "Night blue", value: "#273B70" }
        ]
      },

      danger: {
        title: "Beauty becomes unsettling",
        type: "video",
        src: "media/danger.mp4",
        alt: "The ghost children in the Other World",
        caption:
          "The ghost children reveal the danger behind the attraction.",
        description:
          "Once the promise of the Other World breaks down, its beauty can feel threatening. Sharp contrasts and dark spaces support a reading of the world as a trap rather than an escape.",
        colors: [
          { name: "Warning red", value: "#A83045" },
          { name: "Sickly green", value: "#5B8055" },
          { name: "Deep shadow", value: "#181425" },
          { name: "Faded purple", value: "#6F517E" }
        ]
      },

      home: {
        title: "Seeing home differently",
        type: "video",
        src: "media/home.mp4",
        alt: "Coraline with her real parents",
        caption:
          "A family image used to discuss the meaning of returning home.",
        description:
          "The return home can be read as a change in Coraline's perspective. Ordinary life does not need to become perfect to feel valuable. Color becomes a way to discuss belonging, rather than simply excitement.",
        colors: [
          { name: "Leaf green", value: "#718D65" },
          { name: "Soft sky", value: "#9BB8BA" },
          { name: "Warm cream", value: "#E9DBB6" },
          { name: "Earth brown", value: "#81634D" }
        ]
      }
    };

    function showStage(key, announceChange) {
      const stage = stages[key];

      if (!stage) return;

      video.pause();

      buttons.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.colorStage === key)
        );
      });

      if (stage.type === "video") {
        image.hidden = true;
        video.hidden = false;
        video.setAttribute("aria-label", stage.alt);

        if (video.getAttribute("src") !== stage.src) {
          video.src = stage.src;
          video.load();
        }

        // Если автозапуск заблокирован, доступны обычные controls.
        video.play().catch(function () {});
      } else {
        video.hidden = true;
        image.hidden = false;
        image.src = stage.src;
        image.alt = stage.alt;
      }

      caption.textContent = stage.caption;
      title.textContent = stage.title;
      description.textContent = stage.description;

      palette.replaceChildren();

      stage.colors.forEach(function (color) {
        const item = document.createElement("li");

        const swatch = document.createElement("span");
        swatch.className = "hd-swatch-color";
        swatch.style.backgroundColor = color.value;
        swatch.setAttribute("aria-hidden", "true");

        const name = document.createElement("span");
        name.className = "hd-swatch-name";
        name.textContent = color.name;

        item.append(swatch, name);
        palette.appendChild(item);
      });

      if (announceChange) {
        status.textContent =
          stage.title + ". " + stage.description;
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        showStage(button.dataset.colorStage, true);
      });
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        video.pause();
      }
    });

    showStage("real", false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();