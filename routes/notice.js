const router = require('express').Router();
const Notice = require('../model/Notice');
const verify = require('./verifyToken');

// Create new notice
router.post('/', async (req,res) => {

    // Create new notice
    const notice = new Notice({
        type: req.body.type,
        message: req.body.message,
        shortcut: req.body.url,
        timestamp: req.body.timestamp,
    });
    try{
        const saveNotice = await notice.save();
        res.send(saveNotification);
    }catch(err){
        res.status(400).send(err);
    }
});

// Get a list of notices
router.get('/', async (req, res) => {
    Notice.find((err, data) => {
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
router.delete('/:notId', async (req, res) => {
try {
    const deleteNotice = await Notice.remove(
        { _id: req.params.notId },
    );
    const countNotification = await Notifications.find(
    );
    len = countNotification.data.length;
    res.send(len);
}catch (err) {
    res.send(err);
}
});

module.exports = router;
