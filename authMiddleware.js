module.exports = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Si no está autenticado, redirige al usuario al formulario de inicio de sesión.
};