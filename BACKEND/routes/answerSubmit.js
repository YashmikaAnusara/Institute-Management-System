const express = require("express");
const router = express.Router();
const Answer = require("../models/answerSubmit");

//exam add
router.route("/addAnswer").post((req, res) => {
  const examname = req.body.examname;
  const name = req.body.name;
  const content = req.body.content;

  console.log(name);
  const newAnswer = new Answer({
    examname,
    name,
    content,
  });

  newAnswer.save();
});

router.route("/getAnswer").get((req, res) => {
  Answer.find().then((foundex) => res.json(foundex));
});



module.exports = router;
