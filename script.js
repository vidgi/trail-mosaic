document.addEventListener("DOMContentLoaded", () => {
  let currentBrushSrc = "";
  let currentStickerSize = 50;

  const sizeSlider = document.getElementById("stickerSize");
  sizeSlider.addEventListener("input", function () {
    currentStickerSize = this.value;
  });

  function createSticker(src) {
    const stickerImg = document.createElement("img");
    stickerImg.src = src;
    stickerImg.style.position = "absolute";
    stickerImg.style.width = `${currentStickerSize}px`;
    stickerImg.style.pointerEvents = "none";
    return stickerImg;
  }

  document.querySelectorAll(".sticker").forEach((sticker) => {
    sticker.addEventListener("click", function () {
      document.querySelectorAll(".sticker").forEach((s) => s.classList.remove("selected"));
      sticker.classList.add("selected");
      currentBrushSrc = sticker.getAttribute("src");
      updateCursorForCanvas(currentBrushSrc);
    });
  });

  document.getElementById("canvas").addEventListener("mouseenter", function () {
    if (currentBrushSrc) {
      this.style.cursor = `url('${currentBrushSrc}'), auto`;
    }
  });

  document.getElementById("canvas").addEventListener("mouseleave", function () {
    this.style.cursor = "default";
  });

  document.getElementById("canvas").addEventListener("mousedown", function (e) {
    if (!currentBrushSrc) return;
    isMouseDown = true;
    paintSticker(e.pageX, e.pageY);
  });

  document.getElementById("canvas").addEventListener("mousemove", function (e) {
    if (isMouseDown && currentBrushSrc) {
      paintSticker(e.pageX, e.pageY);
    }
  });

  document.addEventListener("mouseup", function () {
    isMouseDown = false;
  });

  function paintSticker(pageX, pageY) {
    const sticker = createSticker(currentBrushSrc);
    const canvasRect = document.getElementById("canvas").getBoundingClientRect();
    sticker.style.left = `${pageX - canvasRect.left - currentStickerSize / 2}px`;
    sticker.style.top = `${pageY - canvasRect.top - currentStickerSize / 2}px`;
    document.getElementById("canvas").appendChild(sticker);
  }

  const dragHandle = document.getElementById("dragHandle");
  const sidePane = document.getElementById("sidePane");
  let isResizing = false;

  dragHandle.addEventListener("mousedown", function (e) {
    e.preventDefault();
    isResizing = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  });

  function handleMouseMove(e) {
    if (!isResizing) {
      return;
    }
    let newWidth = e.clientX;
    sidePane.style.width = `${newWidth}px`;
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
  }
});
