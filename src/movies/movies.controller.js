const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const exists = async (req, res, next) => {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie not found." });
};

const read = async (req, res, next) => {
  const movie = res.locals.movie;
  res.json({ data: await moviesService.read(movie.movie_id) });
};

const readTheatersByMovie = async (req, res, next) => {
  const movie = res.locals.movie;
  res.json({ data: await moviesService.readTheatersByMovie(movie.movie_id) });
};

const readReviewsByMovie = async (req, res, next) => {
  const movie = res.locals.movie;
  res.json({ data: await moviesService.readReviewsByMovie(movie.movie_id) });
};

const list = async (req, res, next) => {
  if (req.query) {
    req.query.is_showing === "true" &&
      res.json({ data: await moviesService.listMoviesCurrentlyShowing() });
  }
  else {
    res.json({ data: await moviesService.list() });
  }
};

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(exists), asyncErrorBoundary(read)],
  readTheatersByMovie: [
    asyncErrorBoundary(exists),
    asyncErrorBoundary(readTheatersByMovie),
  ],
  readReviewsByMovie: [
    asyncErrorBoundary(exists),
    asyncErrorBoundary(readReviewsByMovie),
  ],
};
