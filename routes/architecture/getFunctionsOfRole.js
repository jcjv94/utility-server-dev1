/*
 ** Description: Get the functions associated with role for a intent+focus+role
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const FunctionsRoleMap = require('../../models/baamdaArchitecture/functionRoleMap');

// @route   GET /routes/architecture/getFunctionsOfRole
// @desc    Checks if a item exists for validation.
// @access  public
router.get("/", async (req, res) => {
    // console.log('getFunctionOfRole Req.query:', req.query)
    try {
        let filter = { focus: req.query.focus, intent: req.query.intent, role: req.query.role }
        // console.log('filter:', filter);
        let ret = await FunctionsRoleMap.find( filter ).select('-_id functions');
        // console.log('ret:', ret);
        res.status(200).send({status: 'Success', Msg: ret});
    } catch (err) {
        console.log('Err:' , err.message);
        res.status(400).json({status: 'Error', Msg: err.message});
    }
    // res.send('getFunctionOfRole');
});

module.exports = router;