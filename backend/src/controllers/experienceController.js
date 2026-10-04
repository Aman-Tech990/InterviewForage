import * as service from '../services/experienceService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendPaginated, sendSuccess } from '../utils/response.js';

export const list = asyncHandler(async (req, res) => {
  const { items, pagination } = await service.list(req.user.id, req.valid.query);
  sendPaginated(res, items, pagination);
});
export const get = asyncHandler(async (req, res) => sendSuccess(res, { experience: await service.get(req.user.id, req.valid.params.id) }));
export const create = asyncHandler(async (req, res) => sendSuccess(res, { experience: await service.create(req.user.id, req.valid.body) }, 201));
export const update = asyncHandler(async (req, res) =>
  sendSuccess(res, { experience: await service.update(req.user.id, req.valid.params.id, req.valid.body) }));
export const remove = asyncHandler(async (req, res) => {
  await service.remove(req.user.id, req.valid.params.id);
  sendSuccess(res, { deleted: true });
});
