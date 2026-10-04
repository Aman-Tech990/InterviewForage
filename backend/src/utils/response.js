export function sendSuccess(res, data = {}, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendPaginated(res, items, pagination) {
  return sendSuccess(res, { items, pagination });
}
