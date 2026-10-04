import * as service from '../services/codeReviewService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendPaginated, sendSuccess } from '../utils/response.js';

export const create = asyncHandler(async (req, res) => sendSuccess(res, { review: await service.create(req.user.id, req.valid.body) }, 201));
export const list = asyncHandler(async (req, res) => {
  const { items, pagination } = await service.list(req.user.id, req.valid.query);
  sendPaginated(res, items, pagination);
});
export const get = asyncHandler(async (req, res) => sendSuccess(res, { review: await service.get(req.user.id, req.valid.params.id) }));
