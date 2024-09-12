const Memory = require("../models/memories.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/AppError");
const asyncWrapper = require("../middleware/asyncWrapper");
const { validationResult } = require("express-validator");

const getAllMemories = asyncWrapper(async (req, res, next) => {
  const memories = await Memory.find({}, { __v: false });
  if (!memories) {
    const error = appError.create(
      "course not found",
      404,
      httpStatusText.ERROR
    );
    return next(error);
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: memories });
});

const addMemory = asyncWrapper(async (req, res, next) => {
  console.log(req.file.filename);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, data: null, error: errors.array() });
  }

  const newMemory = new Memory({
    ...req.body,
    creator: req.user.id,
    createdAt: new Date().toISOString(),
    image: req.file.path,
  });

  await newMemory.save();
  res.status(201).json({ status: httpStatusText.SUCCESS, data: newMemory });
});

const getMemory = asyncWrapper(async (req, res, next) => {
  const memory = await Memory.findById(req.params.memoryId);

  if (!memory) {
    const error = appError.create(
      "Memory Not Found",
      404,
      httpStatusText.ERROR
    );
    return next(error);
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { memory } });
});

const updateMemory = asyncWrapper(async (req, res, next) => {
  const { memoryId } = req.params;
  const { title, message, selectedFile, tags, creator } = req.body;
  const updatedMemory = {
    title,
    message,
    selectedFile,
    tags,
    creator,
    _id: memoryId,
  };
  await Memory.findByIdAndUpdate(memoryId, updatedMemory, { new: true });
  return res.status(201).json({ data: updatedMemory });
});

const deleteMemory = asyncWrapper(async (req, res, next) => {
  const memroy_Id = req.params.memoryId;
  await Memory.deleteOne({ _id: memroy_Id });
  res.status(204).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllMemories,
  getMemory,
  addMemory,
  updateMemory,
  deleteMemory,
};
