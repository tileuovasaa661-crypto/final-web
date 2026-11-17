(function () {
  function init() {
    const slider = document.getElementById("frameSlider");
    const output = document.getElementById("frameOutput");
    const puppet = document.getElementById("framePuppet");
    const playButton = document.getElementById("framePlay");

    if (!slider || !output || !puppet || !playButton) return;

    const poses = [
      { x: -65, y: 0, rotation: -12 },
      { x: -47, y: -8, rotation: -8 },
      { x: -28, y: -20, rotation: -4 },
      { x: -9, y: -29, rotation: 0 },
      { x: 9, y: -29, rotation: 4 },
      { x: 28, y: -20, rotation: 8 },
      { x: 47, y: -8, rotation: 12 },
      { x: 65, y: 0, rotation: 0 }
    ];

    let timer = null;

    function renderFrame() {
      const frame = Number(slider.value);
      const pose = poses[frame - 1];

      puppet.style.transform =
        "translate(" + pose.x + "px, " + pose.y + "px) " +
        "rotate(" + pose.rotation + "deg)";

      output.textContent = "Frame " + frame + " of " + poses.length;

      slider.setAttribute(
        "aria-valuetext",
        "Frame " + frame + " of " + poses.length
      );
    }

    function stop() {
      if (timer !== null) {
        window.clearInterval(timer);
      }

      timer = null;
      playButton.textContent = "Play sequence";
      playButton.setAttribute("aria-pressed", "false");
    }

    slider.addEventListener("input", function () {
      stop();
      renderFrame();
    });

    playButton.addEventListener("click", function () {
      if (timer !== null) {
        stop();
        return;
      }

      slider.value = "1";
      renderFrame();

      playButton.textContent = "Pause sequence";
      playButton.setAttribute("aria-pressed", "true");

      timer = window.setInterval(function () {
        const currentFrame = Number(slider.value);

        if (currentFrame >= poses.length) {
          stop();
          return;
        }

        slider.value = String(currentFrame + 1);
        renderFrame();
      }, 180);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      }
    });

    window.addEventListener("pagehide", stop);

    renderFrame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();