const BaseController = require("./baseController");

class SightingsController extends BaseController {
  constructor(model, categoryModel, commentModel) {
    super(model);
    this.categoryModel = categoryModel;
    this.commentModel = commentModel;
  }

  // Create sighting
  async insertOne(req, res) {
    const { date, location, notes, selectedCategoryIds } = req.body;
    try {
      // Create new sighting
      const newSighting = await this.model.create({
        date: new Date(date),
        location: location,
        notes: notes,
      });
      // Retrieve selected categories
      const selectedCategories = await this.categoryModel.findAll({
        where: {
          id: selectedCategoryIds,
        },
      });
      // Associated new sighting with selected categories
      await newSighting.setCategories(selectedCategories);
      // Respond with new sighting
      return res.json(newSighting);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve specific sighting
  async getOne(req, res) {
    const { sightingId } = req.params;
    try {
      const sighting = await this.model.findByPk(sightingId, {
        include: this.categoryModel,
      });
      return res.json(sighting);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Update sighting
  async updateOne(req, res) {
    const { sightingId } = req.params;
    const { date, location, notes } = req.body;
    try {
      // Find exisitng sighting by Id
      const existingSighting = await this.model.findByPk(sightingId);
      if (!existingSighting) {
        return res.status(404).json({ error: true, msg: err });
      }
      // Update Sighting data
      existingSighting.date = new Date(date);
      existingSighting.location = location;
      existingSighting.notes = notes;
      await existingSighting.save();
      // Respond with updated sighting
      return res.json(existingSighting);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve all comments for specific sighting
  async getComments(req, res) {
    const { sightingId } = req.params;
    try {
      const comments = await this.commentModel.findAll({
        where: {
          sightingId: sightingId,
        },
      });
      return res.json(comments);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Create comment for specific sighting
  async insertOneComment(req, res) {
    const { sightingId } = req.params;
    const { content } = req.body;
    try {
      const newComment = await this.commentModel.create({
        content: content,
        sightingId: sightingId,
      });
      return res.json(newComment);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = SightingsController;
