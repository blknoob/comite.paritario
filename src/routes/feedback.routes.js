const express = require("express");
const router = express.Router();
const path = require("path");
const { storage } = require('../models/cloudinary');
const multer = require('multer');
const upload = multer({ storage });


const {
  showForm,
  submitFeedback,
  deleteFeedback,
  showAdmin,
  showSeguimiento,
  updateReclamo,
} = require("../controllers/feedback.controller.js");

const FeedbackManager = require("../managers/feedback.manager.js");
const feedbackManager = new FeedbackManager();

// Configuración de multer



// Middleware: proteger admin
function checkAuth(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect("/login");
}

// Función reutilizable para limpiar sesión al cambiar de vista
function clearSessionAndRender(handler) {
  return (req, res) => {
    if (req.session.isAdmin) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect(req.originalUrl);
      });
    } else {
      handler(req, res);
    }
  };
}

// Login GET
router.get("/login", (req, res) => {
  res.render("login");
});

// Login POST (solo contraseña)
router.post("/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    req.session.isAdmin = true;
    return res.redirect("/admin");
  }
  res.render("login", { error: "❌ Contraseña incorrecta" });
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

// Rutas públicas que eliminan sesión si está activa
router.get("/", clearSessionAndRender((req, res) => res.render("inicio")));
router.get("/form", clearSessionAndRender(showForm));
router.get("/seguimiento", clearSessionAndRender(showSeguimiento));
router.get("/gracias", clearSessionAndRender((req, res) => res.render("gracias")));

// Enviar formulario
router.post("/enviar", upload.array("imagenes", 5), submitFeedback);


// Admin protegido
router.get("/admin", checkAuth, showAdmin);
router.post("/admin/actualizar/:id", checkAuth, updateReclamo);
router.post("/admin/eliminar/:id", checkAuth, deleteFeedback);

// Ruta para cargar imágenes desde Cloudinary desde el admin
router.get('/admin/imagenes/:id', checkAuth, async (req, res) => {
  try {
    const feedback = await feedbackManager.getFeedbackById(req.params.id);
    res.render('imagenes', { feedback, origen: 'admin' });
  } catch (err) {
    res.status(500).send('❌ Error al cargar imágenes: ' + err.message);
  }
});


// ruta para cargar imagenes desde seguimiento
router.get('/seguimiento/imagenes/:id', async (req, res) => {
  try {
    const feedback = await feedbackManager.getFeedbackById(req.params.id);
    res.render('imagenes', { feedback, origen: 'seguimiento' });
  } catch (err) {
    res.status(500).send('❌ Error al cargar imágenes: ' + err.message);
  }
});



module.exports = router;
