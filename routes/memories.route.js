const express = require("express");
const router = express.Router();
const memoriesController = require("../controllers/memories.controller");
const { memorySchema } = require("../middleware/memorySchema");
const auth = require("../middleware/auth");
const {cloudinaryFileUploader} = require("../middleware/fileUploader");



router
  .route("/")
  .get(memoriesController.getAllMemories)
  .post(
    cloudinaryFileUploader,
    auth.authenticateToken,
    memorySchema(),
    memoriesController.addMemory
  );

router
  .route("/:memoryId")
  .get(memoriesController.getMemory)
  .patch(auth.authenticateToken, memoriesController.updateMemory)
  .delete(auth.authenticateToken, memoriesController.deleteMemory);

module.exports = router;


