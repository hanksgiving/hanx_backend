const router = require('express').Router();
const PortfolioBalance = require('../model/PortfolioBalance');
const verify = require('./verifyToken');

// Create New Funding
router.post('/', verify, async (req,res) => {

    //Check if Funding already exists
    const portfolioBalance = await PortfolioBalance.findOne({timeOfFunding: req.body.timeOfFunding});
    if(portfolioBalance) return res.status(400).send('User Funding record already exists')

    // Create new Funding
    const pBalance = new portfolioBalance({
        userId: req.body.userId,
        fundId: req.body.fundId,
        fundingAmount: req.body.fundingAmount,
        updateDate: req.body.updateDate,
    });
    try{
        const savedBalance = await pBalance.save();
        res.send({pBalanceId: pBalance._id, userId: pBalance.userId, fundingAmount: pBalance.fundingAmount, updateDate: pBalance.updateDate});
    }catch(err){
        res.status(400).send(err);
    }

    /*//Checking if user exists
    const emailExist = await accountValidation.findOne({username: req.body.username, password:req.body.password});
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(emailExist) return res.status(400).send('User Account already exists');*/
});

// Updated Funding Details
router.patch('/:userId/:fundId', verify, async (req, res) => {

    try {
        /*const getAccount = await Account.findById(req.params.accountId);
        res.json(getAccount);
        */
        const updatedFunding = await PortfolioBalance.updateOne(
            { "userId": req.params.userId, "fundId": req.params.fundId },
            { $set: {"fundingAmount": req.body.fundingAmount}}
        );
        //test.fundings.save(updatedFunding);
        res.send({timeOfFunding: req.params.timeOfFunding, fundingAmount: req.body.fundingAmount});
    }catch (err) {
        res.json({message: err });
    }
});

// Get user fund Balances
router.get('/:userId', verify, async (req, res) => {
    const investment = await PortfolioBalance.find({userId: req.params.userId});
    res.send({investment});
});


module.exports = router;