const router = require('express').Router();
const Account = require('../model/Account');
const verify = require('./verifyToken');
const bcrypt = require('bcryptjs');
const {accountValidation} = require('../validation');

// User Bank Account Login
router.post('/', verify, async (req,res) => {
    //Validate
    const {error} = accountValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if account already exists
    const accountExist = await Account.findOne({username: req.body.username});
    if(accountExist) return res.status(400).send('User Account already exists')

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new account
    const account = new Account({
        bankId: req.body.bankId,
        username: req.body.username,
        password: hashedPassword
    });
    try{
        const savedAccount = await account.save();
        res.send({accountId: account._id, bankId: account.bankId});
    }catch(err){
        res.status(400).send(err);
    }

    /*//Checking if user exists
    const emailExist = await accountValidation.findOne({username: req.body.username, password:req.body.password});
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(emailExist) return res.status(400).send('User Account already exists');*/
});

// Updated Account Details
router.patch('/:accountId', verify, async (req, res) => {

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
        /*const getAccount = await Account.findById(req.params.accountId);
        res.json(getAccount);
        */
        const updatedAccount = await Account.updateOne(
            { _id: req.params.accountId },
            { $set: { username: req.body.username, password: hashedPassword}}
        );
        res.send({accountId: req.params.accountId});
    }catch (err) {
        res.json({message: err });
    }
});

module.exports = router;
