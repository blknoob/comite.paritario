const Feedback  = require("../models/suggestions"); // Asegúrate de que la ruta sea correcta


class FeedbackManager {
  constructor() {
    this.feedback = Feedback;
  }

  async getAllFeedback(query = {}, page = 1, limit = 10) {
    try {
      const options = {
        page,
        limit,
        sort: { createdAt: 1 },
      };
      return await this.feedback.paginate(query, options);
    } catch (error) {
      throw new Error("Error al obtener los comentarios: " + error.message);
    }
  }

  async getFeedbackById(id) {
    try {
      return await this.feedback.findById(id);
    } catch (error) {
      throw new Error("Error al obtener el comentario: " + error.message);
    }
  }

  async createFeedback(feedbackData) {
    try {
      const feedback = new this.feedback(feedbackData);
      return await feedback.save();
    } catch (error) {
      throw new Error("Error al crear el comentario: " + error.message);
    }
  }



  async updateFeedback(id, feedbackData) {
    try {
      return await this.feedback.findByIdAndUpdate(id, feedbackData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error("Error al actualizar el comentario: " + error.message);
    }
  }

  async deleteFeedback(id) {
    try {
      return await this.feedback.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error al eliminar el comentario: " + error.message);
    }
  }
}

module.exports = FeedbackManager;
  