/*
 ** Description: This is invoked when updating existing group.
 */
const express = require("express");
const router = express.Router();


// @route   POST /routes/dashboard/testPost
// @desc    Saves a new catalog item.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
    console.log('req.body:', req.body);

    res.send('in updateGroup');
});

module.exports = router;