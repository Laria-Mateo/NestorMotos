export function mapsEmbedUrl(mapQuery: string, zoom = 17): string {
  const [latRaw, lngRaw] = mapQuery.split(',').map((part) => part.trim());
  const lat = Number(latRaw);
  const lng = Number(lngRaw);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${zoom}&hl=es&output=embed`;
  }

  return `https://maps.google.com/maps?q=loc:${lat}+${lng}&ll=${lat},${lng}&z=${zoom}&hl=es&t=m&output=embed`;
}
