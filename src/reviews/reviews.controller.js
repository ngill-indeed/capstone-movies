const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const exists = async (req, res, next) => {
  const review = await reviewsService.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
};

const update = async (req, res, next) => {
  const review = res.locals.review.review_id;
  let updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await reviewsService.update(updatedReview);
  updatedReview = await reviewsService.read(review);
  res.json({ data: updatedReview });
};

const destroy = async (req, res, next) => {
  await reviewsService.delete(res.locals.review.review_id);
  res.sendStatus(204);
};

module.exports = {
  update: [asyncErrorBoundary(exists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(exists), asyncErrorBoundary(destroy)],
};
