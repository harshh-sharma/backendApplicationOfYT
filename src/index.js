import dotenv from "dotenv";
import app from "./app.js";
import connectToDb from "./db/db.js";
dotenv.config();
const PORT = process.env.PORT || 3500;

app.listen(PORT,async() => {
    await connectToDb();
    console.log(`server successfully runining on http://localhost:${PORT}`);
});


