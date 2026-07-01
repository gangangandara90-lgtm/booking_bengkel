export function hasCoordinates(item) {
  const lat = Number(item?.latitude);
  const lng = Number(item?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng);
}

export function formatCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(6) : "";
}

export function getGoogleMapsUrl(item) {
  if (item?.mapsUrl) return item.mapsUrl;
  if (!hasCoordinates(item)) return "";
  return `https://www.google.com/maps?q=${Number(item.latitude)},${Number(item.longitude)}`;
}

export function getOsmEmbedUrl(item) {
  if (!hasCoordinates(item)) return "";
  const lat = Number(item.latitude);
  const lng = Number(item.longitude);
  const offset = 0.004;
  const bbox = [lng - offset, lat - offset, lng + offset, lat + offset].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
