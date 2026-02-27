const express = require("express");
const { identifyContact } = require("./contact.service");

const router = express.Router();

router.post("/identify", async (req, res) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res
            .status(400)
            .json({ error: "At least one of email or phoneNumber is required." });
    }

    const result = await identifyContact(
        email || null,
        phoneNumber ? String(phoneNumber) : null
    );

    res.status(200).json(result);
});

module.exports = router;
