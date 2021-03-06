const router = require('express').Router();
const Notifications = require('../model/Notifications');
const verify = require('./verifyToken');

// Create new notification
router.post('/', async (req,res) => {

    // Create new notification
    const notification = new Notifications({
        firmId: req.body.firmId,
        type: req.body.type,
        message: req.body.message,
        product: req.body.product,
        shortcut: req.body.url,
        timestamp: req.body.timestamp,
    });
    try{
        const saveNotification = await notification.save();
        res.send(saveNotification);
    }catch(err){
        res.status(400).send(err);
    }
});
// Get a list of notifications
router.get('/:firmId', async (req, res) => {
    Notifications.find({firmId: req.params.firmId},(err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});
/*
// Get a list of notifications
router.get('/', async (req, res) => {
    Notifications.find((err, data) => {
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

// Delete a notification
router.delete('/:notId', async (req, res) => {
try {
    const deleteNotification = await Notifications.remove(
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
