import * as authService from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const register = asyncHandler(async (req, res) => sendSuccess(res, await authService.register(req.valid.body), 201));
export const login = asyncHandler(async (req, res) => sendSuccess(res, await authService.login(req.valid.body)));
export const me = (req, res) => sendSuccess(res, { user: req.user });
// Tokens are stateless; the client discards its token. This endpoint exists so the API has one logout contract.
export const logout = (_req, res) => sendSuccess(res, { loggedOut: true });
