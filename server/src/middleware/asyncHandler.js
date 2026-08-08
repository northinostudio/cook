// Express 4 doesn't forward rejected promises from async handlers to the
// error middleware on its own — without this, a thrown/rejected error in a
// route just hangs the request instead of returning a response.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
