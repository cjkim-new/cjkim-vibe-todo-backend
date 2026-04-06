const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "할일(text)을 입력해주세요." });
    }

    const todo = await Todo.create({ text: text.trim() });
    return res.status(201).json(todo);
  } catch (error) {
    return res.status(500).json({ message: "할일 저장 실패", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ message: "할일 조회 실패", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    return res.status(200).json(todo);
  } catch (error) {
    return res.status(400).json({ message: "잘못된 ID 형식입니다.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "수정할 할일(text)을 입력해주세요." });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text: text.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    return res.status(200).json(updatedTodo);
  } catch (error) {
    return res.status(400).json({ message: "할일 수정 실패", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    return res.status(200).json({ message: "할일 삭제 성공", todo: deletedTodo });
  } catch (error) {
    return res.status(400).json({ message: "할일 삭제 실패", error: error.message });
  }
});

module.exports = router;
