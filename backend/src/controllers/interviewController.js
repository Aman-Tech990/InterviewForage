import * as service from '../services/interviewService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendPaginated, sendSuccess } from '../utils/response.js';

export const create = asyncHandler(async (req, res) => sendSuccess(res, { interview: await service.create(req.user.id, req.valid.body) }, 201));
export const list = asyncHandler(async (req, res) => {
  const { items, pagination } = await service.list(req.user.id, req.valid.query);
  sendPaginated(res, items, pagination);
});
export const get = asyncHandler(async (req, res) => sendSuccess(res, { interview: await service.get(req.user.id, req.valid.params.id) }));
export const answer = asyncHandler(async (req, res) =>
  sendSuccess(res, { interview: await service.answer(req.user.id, req.valid.params.id, req.valid.body.answer) }));
export const finish = asyncHandler(async (req, res) => sendSuccess(res, { interview: await service.finish(req.user.id, req.valid.params.id) }));
