require("dotenv").config();
const express = require("express");
const contactRouter = require("./contact/contact.router");

const app = express();
app.use(express.json());

app.use("/", contactRouter);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
