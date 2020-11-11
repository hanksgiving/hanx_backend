const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {registerValidation} = require('../validation');
const {loginValidation} = require('../validation');




router.post('/register', async (req,res) =>
{
    //Validate
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if user exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Generate a firmid
    const firmid = '009900' + uuidv4();

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        firmid: firmid
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id, firmid: user.firmid});
    }catch(err){
        res.status(400).send(err);
    }
});

// Login
router.post('/login', async (req,res) => {
    //Validate
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({error: 'Email does not exist'});

    //Password Correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send({error: 'Invalid password'});

    //Create and Assign Token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({firmid: user.firmid, key: token});
});

module.exports = router;