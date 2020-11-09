const router = require('express').Router();
const Fund = require('../model/FundManager');
const verify = require('./verifyToken');
const Portfolio = require('./portfolio');

// Create New Funding
router.post('/', verify, async (req,res) => {

    //Check if Funding already exists
    const fundingExist = await Fund.findOne({fundId: req.body.fundId});
    if(fundingExist) return res.status(400).send('Fund Already Exists')

    // Create new Fund
    const fund = new Fund({
        _id: req.body.fundId,
        description: req.body.description,
        sharePrice: req.body.sharePrice,
        fundingAmount: req.body.fundingAmount,
        expectedReturn: req.body.expectedReturn,
        previousReturn: req.body.previousReturn,
        status: req.body.status,
        holdings: req.body.holdings
    });
    try{
        const savedFund = await fund.save();
        res.send({_id: savedFund._id, description: savedFund.description, sharePrice: savedFund.sharePrice, fundingAmount: savedFund.fundingAmount, expectedReturn: savedFund.expectedReturn, previousReturn: savedFund.previousReturn, status: savedFund.status, holdings:savedFund.holdings, creationDate: fund.creationDate});
    }catch(err){
        res.status(400).send(err);
    }

});

// Updated Fund Total Amount
router.patch('/fundTotal/:fundId', verify, async (req, res) => {

    try {
        const updateFund = await Fund.updateOne(
            { "_id": req.params.fundId},
            { $set: { "fundingAmount": req.body.fundingAmount}}
        );
        res.send({fundingAmount: req.body.fundingAmount});
    }catch (err) {
        res.json({message: err });
    }
});

// Updated Fund Holdings
router.patch('fundHoldings/:fundId', verify, async (req, res) => {

    try {
        const updateFund = await Portfolio.updateOne(
            { "_id": req.params.fundId},
            { $set: { "holdings": req.body.holdings}}
        );
        res.send({fundId: updateFund.fundId, holdings: updateFund.holdings});
    }catch (err) {
        res.json({message: err });
    }
});


// Get master list of fund
router.get('/masterFunds', verify, async (req, res) => {
    const funds = await Fund.find({},{fundId:1},{$sort: {fundingDate: 1}});
    res.send(funds);
});



module.exports = router;