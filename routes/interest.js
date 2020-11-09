const router = require('express').Router();
const Cashflow = require('../model/Cashflow');
const verify = require('./verifyToken');

// Add user interest accumulation
router.post('/', verify, async (req,res) => {

    //Check if interest accumulation already exists
    const interestExist = await Cashflow.findOne({interestMonth: req.body.interestMonth});
    if(interestExist) return res.status(400).send('User Interest Payment already exists')

    // Create a new interest accumulation
    const interest = new Cashflow({
        userId: req.body.userId,
        interestAmount: req.body.interestAmount,
        interestMonth: req.body.interestMonth,
    });
    try{
        const savedInterest = await interest.save();
        res.send({interestId: interest._id, userId: interest.userId, interestAmount: interest.interestAmount, interestMonth: interest.interestMonth});
    }catch(err){
        res.status(400).send(err);
    }

    /*//Checking if user exists
    const emailExist = await accountValidation.findOne({username: req.body.username, password:req.body.password});
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(emailExist) return res.status(400).send('User Account already exists');*/
});

// Updated Interest Accumulation Details
router.patch('/:interestMonth', verify, async (req, res) => {

    try {
        /*const getAccount = await Account.findById(req.params.accountId);
        res.json(getAccount);
        */
        const updatedInterest = await Cashflow.updateOne(
            { interestMonth: req.params.interestMonth },
            { $set: { interestAmount: req.body.interestAmount}}
        );
        res.send({interestMonth: req.params.interestMonth, interestAmount: req.params.interestAmount});
    }catch (err) {
        res.json({message: err });
    }
});

router.get('/:userId', verify, async (req, res) => {
    const interestEvent = await Cashflow.find({userId: req.params.userId});
    res.send({interestEvent});
});

router.get('/balance/:userId', verify, async (req, res) => {
    const intbalance = await Cashflow.find({userId: req.params.userId},{interestAmount: 1});
    len = intbalance.length
    var balance = 0;
    for (i=0; i < len; i++) {
        balance = balance + parseFloat(intbalance[i].interestAmount)
    }
    res.send({balance});
});

module.exports = router;