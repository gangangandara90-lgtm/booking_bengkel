export function loadImage(source) {
  return new Promise((resolve, reject) => {
    if (!source) {
      reject(new Error("Sumber foto tidak ditemukan."));
      return;
    }

    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Foto tidak bisa dibaca."));
    image.src = source;
  });
}

export function drawAvatarCanvas(canvas, image, options = {}) {
  if (!canvas || !image) return "";

  const size = options.size || 420;
  const zoom = Number(options.zoom || 1);
  const offsetX = Number(options.offsetX || 0);
  const offsetY = Number(options.offsetY || 0);
  const rotation = Number(options.rotation || 0);
  const radians = (rotation * Math.PI) / 180;
  const isQuarterTurn = Math.abs(rotation / 90) % 2 === 1;
  const visibleWidth = isQuarterTurn ? image.naturalHeight : image.naturalWidth;
  const visibleHeight = isQuarterTurn ? image.naturalWidth : image.naturalHeight;
  const coverScale = Math.max(size / visibleWidth, size / visibleHeight);
  const scale = coverScale * zoom;
  const moveLimit = size * 0.42;
  const moveX = (offsetX / 100) * moveLimit;
  const moveY = (offsetY / 100) * moveLimit;

  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  context.clearRect(0, 0, size, size);
  context.fillStyle = "#f8fafc";
  context.fillRect(0, 0, size, size);

  context.save();
  context.beginPath();
  context.rect(0, 0, size, size);
  context.clip();
  context.translate(size / 2, size / 2);
  context.rotate(radians);
  context.drawImage(
    image,
    -image.naturalWidth * scale / 2 + moveX,
    -image.naturalHeight * scale / 2 + moveY,
    image.naturalWidth * scale,
    image.naturalHeight * scale
  );
  context.restore();

  return canvas.toDataURL("image/jpeg", 0.9);
}
