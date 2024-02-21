require("dotenv").config(); // At the top of your file
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
const connectDB = () => {
  mongoose
    .connect(MONGODB_URI, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
};

connectDB();

const outcomeSchema = new mongoose.Schema({
  number: { type: Number },
  result: { type: Number },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Outcome = mongoose.model("Outcome", outcomeSchema);

const getOutcomeModel = async (number) => {
  const outcome = new Outcome({
    number: number,
    result: fibonacci(number),
    createdDate: Date.now(),
  });
  try {
    await outcome.save();
    return outcome;
  } catch (err) {
    console.error("Error saving result:", err);
  }
};

const getAllOutcomesModel = async () => {
  try {
    const allOutcomes = await Outcome.find();
    return allOutcomes;
  } catch (err) {
    console.error("Error fetching result:", err);
  }
};

function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n === 0) return 0;
  if (n <= 2) return 1;
  return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
}

app.get("/fibonacci/:number", async (req, res) => {
  const number = +req.params.number;
  if (number === 42) {
    return res.status(400).send("42 is the meaning of life");
  }
  if (number > 50) {
    return res.status(400).send("number can't be bigger than 50");
  }
  if (number < 1) {
    return res.status(400).send("number can't be smaller than 1");
  }
  try {
    const outcome = await getOutcomeModel(number);
    res.status(200).send(outcome);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/getFibonacciOutcomes", async (req, res) => {
  try {
    const allOutcomes = await getAllOutcomesModel();
    res.status(200).send(allOutcomes);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send("Internal server error");
  }
});

app.listen(5050, () => {
  console.log("App listening on port 5050");
});
