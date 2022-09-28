const express = require("express");
const User = require("./models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "SDSTASK";


router.post(
    "/register",
    [
      body("email", "Enter valid email").isEmail(),
      body("password", "Password cannot be blank").isLength({ min: 1 }),
      body("name", "name cannot be blank").isLength({ min: 1 }),
      body("username", "username cannot be blank").isLength({ min: 1 })
    ],
    async (req, res) => {
    let success = false;
    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({ error: errors.array()[0].msg });
    //   }
      const { email, password, name, username} = req.body;
      const newpassword= await bcrypt.hash(password, 10);
      console.log(newpassword);
      try {
        let user = await User.findOne({ email });
        if (user) {
          return res
            .status(400)
            .json({ error: "User Already registered" });
        }
        else{
            console.log("creating");
            const newRes = new User({
                name,
                email,
                newpassword,
                username,
            });
            await newRes.save((err, doc) => {
                console.log(doc);
            });
            success = true;
        }
        res.json({success});
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
);


router.post(
    "/login",
    [
      body("email", "Enter valid email").isEmail(),
      body("password", "Password cannot be blank").isLength({ min: 1 }),
    ],
    async (req, res) => {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          success = false;
          return res
            .status(400)
            .json({ error: "Something went wrong please try again" });
        }
        const check = await bcrypt.compare(password, user.newpassword);
        if (!check) {
          success = false;
          return res.status(400).json({
            success,
            error: "Something went wrong please try again",
          });
        }
        const data = {
          user: {
            id: user.id,
          },
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );
  

module.exports = router;