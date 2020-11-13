const router = require('express').Router();
const Profile = require('../model/Profile');
const verify = require('./verifyToken');
const { v4: uuidv4 } = require('uuid');

// Create new notice
router.post('/', async (req,res) => {

    // Generate a firmid
    const firmid = '009900' + uuidv4();

    // Create new notice
    const profiles = new Profile({
        firmid: firmid,
        firmname: req.body.firmname,
        firmpic: req.body.firmpic,
        firmdescription: req.body.firmdescription,
        status: req.body.status,
        timestamp: req.body.timestamp,
    });
    try{
        const saveProfile = await profiles.save();
        res.send(saveProfile);
    }catch(err){
        res.status(400).send(err);
    }
});

// Get a list of profiles
router.get('/:firmid', async (req, res) => {
    Profile.find({firmId: req.params.firmId},(err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});
/*
Get count of notifications
router.get('/count', async (req, res) => {
    try {
        const countNotification = await Notifications.find({firmId: req.params.firmId});
        len = countNotification.length;
        res.send(len);
    }catch (err) {
        res.send(err);
    }
    });*/

// Delete a notice
router.delete('/:firmid', async (req, res) => {
try {
    const deleteProfile = await Profile.deleteOne(
        { firmid: req.params.firmid },
    );
    const countProfile = await Notifications.find(
    );
    len = countProfile.data.length;
    res.send(len);
}catch (err) {
    res.send(err);
}
});

module.exports = router;
