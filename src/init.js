import "dotenv/config"; // === require('dotenv').config();
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000;

app.listen(PORT, () => console.log(`Listening Port http://localhost:${PORT}`));
