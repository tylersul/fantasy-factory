// Detailed notes incoming.  Crafted in vid 443.
module.exports = func => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  }
}