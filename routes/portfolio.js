const router = require('express').Router();
const Portfolio = require('../model/Portfolio');
const verify = require('./verifyToken');

// Create New Funding
router.post('/', verify, async (req,res) => {

    //Check if Funding already exists
    //const fundingExist = await Portfolio.findOne({userId: req.body.userId, fundId: req.body.fundId});
    //if(fundingExist) return res.status(400).send('User Already Invested in Fund')

    // Create new Funding
    const portfolio = new Portfolio({
        userId: req.body.userId,
        fundId: req.body.fundId,
        type: req.body.type,
        fundingAmount: req.body.fundingAmount
    });
    try{
        const savedPortfolio = await portfolio.save();
        res.send({investmentId: portfolio._id, userId: portfolio.userId, fundId:portfolio.fundId, type: portfolio.type, fundingAmount: portfolio.fundingAmount, fundingDate: portfolio.fundingDate});
    }catch(err){
        res.status(400).send(err);
    }

    /*//Checking if user exists
    const emailExist = await accountValidation.findOne({username: req.body.username, password:req.body.password});
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(emailExist) return res.status(400).send('User Account already exists');*/
});

// Updated Funding Details
router.patch('/:investmentId', verify, async (req, res) => {

    try {
        /*const getAccount = await Account.findById(req.params.accountId);
        res.json(getAccount);
        */
        const updatePortfolio = await Portfolio.updateOne(
            { "_id": req.params.investmentId, "fundId": req.body.fundId},
            { $set: { "fundingAmount": req.body.fundingAmount}}
        );
        res.send({investmentId: req.params.investmentId, fundId: req.body.fundId, fundingAmount: req.body.fundingAmount});
    }catch (err) {
        res.json({message: err });
    }
});

// Get user investment fund transaction for all funds
router.get('/:userId', verify, async (req, res) => {
    const investment = await Portfolio.find({userId: req.params.userId});
    res.send({investment});
});

// Get user balance for all funds
router.get('/balance/:userId', verify, async (req, res) => {
    const portfolioBalance = await Portfolio.aggregate([{$match: {userId: req.params.userId}},{$group: {
        _id:"$fundId",
        fundingAmount: {
          $sum: "$fundingAmount"
        },
        fundingDate: {$first: "$fundingDate"}
      }},{$sort: {fundingDate: 1}}]);
    /*  
    len = portfolioBalance.length
    var depbalance = 0;
    var withbalance = 0;
    var deposit = Array(0,0);
    var withdraw= Array(0,0);
    for (z=0; z < len; z++) {

    }
    for (x=0; x < len; x++) {
        
        portfolioBalance[x].fundingAmount = portfolioBalance[x].fundingAmount/100
    }
    for (i=0; i < len; i++) {
        depbalance = depbalance + parseFloat(deposit[i]);
        withbalance = withbalance + parseFloat(withdraw[i]);
        balance = depbalance-withbalance;
    }*/

    res.send({portfolioBalance});
});

// Get user balance for all funds
router.get('/usedbalance/:userId', verify, async (req, res) => {
    const usedBalance = await Portfolio.aggregate([{$match: {userId: req.params.userId}},
        {$group: {
            _id: null,
            amount: {$sum: "$fundingAmount"}
        }
    }]);

    res.send({usedBalance});
});

    /*const investment = await Portfolio.aggregate([
        {$match : {"userId" : req.params.userId}},
        {$group : {
            "fundId" : { "$addToSet" :"$fundId"},
            "_id": null
        }
        }]);
    //const investment = await Portfolio.find({userId: req.params.userId});
    res.send({investment});
});*/

// Get user transactions for specific fund
router.get('/transactions/:userId/:fundId', verify, async (req, res) => {
    const investment = await Portfolio.find({userId: req.params.userId, fundId: req.params.fundId});
    res.send({investment});
});

// Get user investment balance per fund
/*router.get('/funds/:userId', verify, async (req, res) => {
    const portfolioBalance = await Portfolio.find({userId: req.params.userId}, {fundId: 1, type: 1, fundingAmount: 1});
    
    len = portfolioBalance.length
    var depbalance = 0;
    var withbalance = 0;
    var deposit = Array(0,0);
    var withdraw= Array(0,0);
    for (x=0; x < len; x++) {
        if (portfolioBalance[x].type == "deposit"){
            deposit[x] = portfolioBalance[x].fundingAmount;
        }
        else if (portfolioBalance[x].type == "withdraw"){
            withdraw[x] = portfolioBalance[x].fundingAmount;
        }
    }
    for (i=0; i < len; i++) {
        depbalance = depbalance + parseFloat(deposit[i]);
        withbalance = withbalance + parseFloat(withdraw[i]);
        balance = depbalance-withbalance;
    }
    res.send(portfolioBalance);
    //res.send({balance}, portfolioBalance.fundId);
});*/


// Get user investment balance per fund
router.get('/balance/:userId/:fundId', verify, async (req, res) => {
    const portfolioBalance = await Portfolio.find({userId: req.params.userId, fundId: req.params.fundId}, {type: 1, fundingAmount: 1});
    len = portfolioBalance.length
    var depbalance = 0;
    var withbalance = 0;
    var deposit = Array(0,0);
    var withdraw= Array(0,0);
    for (x=0; x < len; x++) {
        if (portfolioBalance[x].type == "deposit"){
            deposit[x] = portfolioBalance[x].fundingAmount;
        }
        else if (portfolioBalance[x].type == "withdraw"){
            withdraw[x] = portfolioBalance[x].fundingAmount;
        }
    }
    for (i=0; i < len; i++) {
        depbalance = depbalance + parseFloat(deposit[i]);
        withbalance = withbalance + parseFloat(withdraw[i]);
        balance = depbalance-withbalance;
    }
    res.send({balance}, req.body.fundId);
});


module.exports = router;