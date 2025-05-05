const FeedbackManager = require("../managers/feedback.manager");
const feedbackManager = new FeedbackManager();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../models/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "comite-paritario",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

const showForm = (req, res) => {
  res.render("form", { title: "Feedback Form" });
};

const submitFeedback = async (req, res) => {
  try {
    const { nombre, tipo, mensaje } = req.body;
    let imagenesUrl = [];

    if (req.files && req.files.length > 0) {
      imagenesUrl = req.files.map((file) => file.path);
    }

    await feedbackManager.createFeedback({
      nombre,
      tipo,
      mensaje,
      imagenes: imagenesUrl, // ← guarda array correctamente
    });

    res.redirect("/gracias");
  } catch (err) {
    res.status(500).send("❌ Error al guardar el comentario: " + err.message);
  }
};

const showAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const lista = await feedbackManager.getAllFeedback({}, page, 10);

    const offset = (page - 1) * 10;
    lista.docs = lista.docs.map((item, index) => ({
      _id: item._id,  // ✅ importante
      numero: offset + index + 1,
      nombre: item.nombre,
      tipo: item.tipo,
      mensaje: item.mensaje,
      imagenes: item.imagenes && item.imagenes.length ? item.imagenes : [],  // ✅ asegura array
      estado: item.estado,
      comentarioSolucion: item.comentarioSolucion,
      createdAt: item.createdAt.toLocaleString("es-CL", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    }));

    res.render("admin", { lista });
  } catch (err) {
    res.status(500).send("❌ Error al cargar admin: " + err.message);
  }
};

const showSeguimiento = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const lista = await feedbackManager.getAllFeedback({}, page, 10);

    const offset = (page - 1) * 10;
    lista.docs = lista.docs.map((item, index) => ({
      _id: item._id,  // ✅ importante
      numero: offset + index + 1,
      mensaje: item.mensaje,
      imagenes: item.imagenes && item.imagenes.length ? item.imagenes : [],  // ✅ asegura array
      estado: item.estado,
      comentarioSolucion: item.comentarioSolucion,
      createdAtFormatted: item.createdAt.toLocaleString("es-CL", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    }));

    res.render("seguimiento", { lista });
  } catch (err) {
    res.status(500).send("❌ Error al cargar seguimiento: " + err.message);
  }
};

const updateReclamo = async (req, res) => {
  try {
    const { estado, comentarioSolucion } = req.body;
    await feedbackManager.updateFeedback(req.params.id, {
      estado,
      comentarioSolucion,
    });
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send("❌ Error al actualizar reclamo: " + err.message);
  }
};

const deleteFeedback = async (req, res) => {
  try {
    await feedbackManager.deleteFeedback(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send("❌ Error al eliminar el comentario: " + err.message);
  }
};

module.exports = {
  showForm,
  submitFeedback,
  showAdmin,
  updateReclamo,
  showSeguimiento,
  deleteFeedback,
};
