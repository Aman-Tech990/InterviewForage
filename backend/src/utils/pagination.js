export function skipTake(page, limit) {
  return { skip: (page - 1) * limit, take: limit };
}

export function buildPagination(page, limit, total) {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
