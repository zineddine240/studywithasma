export function getPagination(page: number, size: number = 10) {
  const limit = size;
  const from = (page - 1) * limit;
  const to = from + size - 1;

  return { from, to, limit };
}

export function getTotalPages(count: number | null, size: number = 10) {
  if (!count) return 0;
  return Math.ceil(count / size);
}
