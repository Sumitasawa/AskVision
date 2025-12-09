import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function main() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  const res = await axios.get(url);
  console.log("AVAILABLE MODELS:");
  res.data.models.forEach(m => console.log(m.name));
}

main();
