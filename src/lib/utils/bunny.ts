export function getBunnyEmbedUrl(libraryId: string, videoId: string): string {
  if (!libraryId || !videoId) return "";
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
}

export function getBunnyThumbnailUrl(libraryId: string, videoId: string): string {
  if (!libraryId || !videoId) return "";
  return `https://vz-${libraryId}.b-cdn.net/${videoId}/thumbnail.jpg`;
}
