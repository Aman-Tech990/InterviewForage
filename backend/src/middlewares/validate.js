// Parsed values are stored on req.valid so controllers never read unvalidated input.
export const validate = (schemas) => (req, _res, next) => {
  try {
    req.valid = {
      body: schemas.body ? schemas.body.parse(req.body) : req.body,
      query: schemas.query ? schemas.query.parse(req.query) : req.query,
      params: schemas.params ? schemas.params.parse(req.params) : req.params,
    };
    next();
  } catch (error) {
    next(error);
  }
};
