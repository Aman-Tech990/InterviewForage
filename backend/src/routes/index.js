import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { aiLimiter, authLimiter } from '../middlewares/rateLimiters.js';
import * as v from '../validators.js';
import * as auth from '../controllers/authController.js';
import * as interviews from '../controllers/interviewController.js';
import * as reviews from '../controllers/codeReviewController.js';
import * as experiences from '../controllers/experienceController.js';

const router = Router();
const withId = { params: v.idParam };

router.post('/auth/register', authLimiter, validate({ body: v.registerBody }), auth.register);
router.post('/auth/login', authLimiter, validate({ body: v.loginBody }), auth.login);
router.get('/auth/me', requireAuth, auth.me);
router.post('/auth/logout', requireAuth, auth.logout);

router.use(requireAuth);

router.get('/interviews', validate({ query: v.pageQuery }), interviews.list);
router.post('/interviews', aiLimiter, validate({ body: v.createInterviewBody }), interviews.create);
router.get('/interviews/:id', validate(withId), interviews.get);
router.post('/interviews/:id/answer', aiLimiter, validate({ ...withId, body: v.answerBody }), interviews.answer);
router.post('/interviews/:id/finish', aiLimiter, validate(withId), interviews.finish);

router.get('/code-reviews', validate({ query: v.pageQuery }), reviews.list);
router.post('/code-reviews', aiLimiter, validate({ body: v.codeReviewBody }), reviews.create);
router.get('/code-reviews/:id', validate(withId), reviews.get);

router.get('/experiences', validate({ query: v.experienceQuery }), experiences.list);
router.post('/experiences', validate({ body: v.experienceBody }), experiences.create);
router.get('/experiences/:id', validate(withId), experiences.get);
router.patch('/experiences/:id', validate({ ...withId, body: v.experienceBody.partial() }), experiences.update);
router.delete('/experiences/:id', validate(withId), experiences.remove);

// The RAG module (src/rag) is built but intentionally not mounted. To enable it later,
// add document and search routes here that call src/rag/pipeline and src/rag/retriever.

export default router;
