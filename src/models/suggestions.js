const mongoose = require("mongoose");
// const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const feedbackSchema = new mongoose.Schema(
  {
    nombre: { type: String, default: "Anónimo" },
    tipo: {
      type: String,
      enum: ["reclamo", "sugerencia", "otro"],
      required: true,
    },
    mensaje: { type: String, required: true },
    imagenes: [{ type: String }],
    estado: { type: String, default: "Pendiente" },  // ✅ agregado aquí
    comentarioSolucion: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);


feedbackSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Feedback", feedbackSchema);
