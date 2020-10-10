const express = require('express');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Auth with json web tokens, basically we save a refresh jwt in the cookies and send back an access token, so that can access the apis endpoints
// if the access token is compromised, it isn't that bad, beacause it only lasts 30min


router.get('/', async (req, res) => {
  try {
    const {username, password} = req.body;
    
    const user = await User.findOne({
        username
    })

    if(!user)
        throw new Error("No user found");

    const greenLight = await bcrypt.compare(password, user.password)

    if(!greenLight)
        throw new Error("Invalid password");

    user.refreshTokenVersion += 1;
    await user.save()

    // Generate tokens
    const access_token = jsonwebtoken.sign({user_id :user._id}, process.env.ACCESS_JWT, { expiresIn: "30m" })

    const refresh_token = jsonwebtoken.sign({
        user_id :user._id,
        tokenVersion: user.refreshTokenVersion
    }, process.env.REFRESH_JWT, { expiresIn: "7d" })

    // save refresh token in cookies
    res.cookie("jid", refresh_token)

    res.json({
        success: true,
        access_token
    })
  } catch (error) {
    res.json({
        success: false
    });
    console.error(error);
  }
});

router.get('/refresh', async (req, res) =>{
    try {
        const refresh_token = req.cookies.jid;

        const payload = jsonwebtoken.verify(refresh_token, process.env.REFRESH_JWT);

        const user = await User.findById(payload.user_id);

        if(!user)
            throw new Error("No user, weiird");

        // Check token version
        if(payload.tokenVersion !== user.refreshTokenVersion)
            throw new Error("Invalid/Old token");

        user.refreshTokenVersion += 1;
        await user.save()

        const access_token = jsonwebtoken.sign({user_id :user._id}, process.env.ACCESS_JWT, { expiresIn: "30m" })
        const refresh_tokenNew = jsonwebtoken.sign({
            user_id :user._id,
            tokenVersion: user.refreshTokenVersion        
        }, process.env.REFRESH_JWT, { expiresIn: "7d" })

        // save refresh token in cookies
        res.cookie("jid", refresh_tokenNew)

        res.json({
            success: true,
            access_token
        })
    } catch (error) {
        res.json({
            success: false
        });
        console.error(error);
    }
});

module.exports = router;
