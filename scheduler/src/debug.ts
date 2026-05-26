console.log("1. Starting import");
import "dotenv/config";
console.log("2. dotenv done");
import path from "path";
import { fileURLToPath } from "url";
console.log("3. path done");
import { createClient } from "@supabase/supabase-js";
console.log("4. supabase done");
import { google } from "googleapis";
console.log("5. googleapis done");
import OpenAI from "openai";
console.log("6. openai done");

console.log("All imports finished.");
process.exit(0);
