document.addEventListener("DOMContentLoaded", () => {
  let currentBrushSrc = "";
  let currentStickerSize = 50;
  let isMouseDown = false;
  let isWildcardMode = false;
  let placementTimeout = null;

  const sizeSlider = document.getElementById("stickerSize");
  const wildcardCheckbox = document.getElementById("wildcardMode");
  const stickers = document.querySelectorAll(".sticker");
  const palette = document.getElementById("palette");
  const slider = document.getElementById("slider");
  const canvas = document.getElementById("canvas");
  const dragHandle = document.getElementById("dragHandle");
  const sidePane = document.getElementById("sidePane");

  function downloadMosaic() {
    html2canvas(document.getElementById("canvas")).then(function (canvas) {
      const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");
      var dataURL = canvas.toDataURL("image/png");
      var link = document.createElement("a");
      link.href = dataURL;
      link.download = `trail-mosaic-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  document.getElementById("downloadMosaic").addEventListener("click", downloadMosaic);

  sizeSlider.addEventListener("input", function () {
    currentStickerSize = this.value;
  });

  wildcardCheckbox.addEventListener("change", function () {
    isWildcardMode = this.checked;
    sizeSlider.disabled = isWildcardMode;
    stickers.forEach((sticker) => (sticker.style.pointerEvents = isWildcardMode ? "none" : "auto"));

    // palette.style.display = isWildcardMode ? "none" : "block";
    // slider.style.display = isWildcardMode ? "none" : "block";

    stickers.forEach((sticker) => (sticker.style.opacity = isWildcardMode ? "0.5" : "1"));
    palette.style.opacity = isWildcardMode ? "0.5" : "1";
    slider.style.opacity = isWildcardMode ? "0.5" : "1";

    if (isWildcardMode) {
      canvas.style.cursor = "crosshair";
      document.querySelectorAll(".sticker").forEach((s) => s.classList.remove("selected"));
    } else {
      canvas.style.cursor = "crosshair";
    }
  });

  stickers.forEach((sticker) => {
    sticker.addEventListener("click", function () {
      if (isWildcardMode) return;
      document.querySelectorAll(".sticker").forEach((s) => s.classList.remove("selected"));
      sticker.classList.add("selected");
      currentBrushSrc = sticker.getAttribute("src");
      updateCursorForCanvas(currentBrushSrc);
    });
  });

  canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    paintSticker(e.pageX, e.pageY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      paintSticker(e.pageX, e.pageY);
    }
  });

  document.addEventListener("mouseup", () => {
    isMouseDown = false;
    clearTimeout(placementTimeout);
    placementTimeout = null;
  });
  function updateCursorForCanvas(src) {
    if (!isWildcardMode) {
      canvas.style.cursor = `url('${src}'), auto`;
    }
  }

  function paintSticker(pageX, pageY) {
    if (isWildcardMode) {
      const randomStickerIndex = Math.floor(Math.random() * stickers.length);
      currentBrushSrc = stickers[randomStickerIndex].getAttribute("src");
      currentStickerSize = Math.floor(Math.random() * (300 - 10)) + 10;
    }
    const stickerImg = document.createElement("img");
    stickerImg.src = currentBrushSrc;
    stickerImg.style.position = "absolute";
    stickerImg.style.width = `${currentStickerSize}px`;
    stickerImg.style.pointerEvents = "none";
    const canvasRect = canvas.getBoundingClientRect();
    stickerImg.style.left = `${pageX - canvasRect.left - currentStickerSize / 2}px`;
    stickerImg.style.top = `${pageY - canvasRect.top - currentStickerSize / 2}px`;
    canvas.appendChild(stickerImg);
  }

  dragHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isResizing = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  });

  function handleMouseMove(e) {
    if (!isResizing) return;
    let newWidth = e.clientX;
    sidePane.style.width = `${newWidth}px`;
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
  }
});
