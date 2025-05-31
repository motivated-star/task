const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

async function handleUserSignup(req, res) {
  const { email, password } = req.body;
  console.log(req.body); // Debugging line to check the request body

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials'); 
    }

    const token = jwt.sign(
      {  id: user._id, email: user.email },  
      process.env.JWT_SECRET,     
      { expiresIn: "1h" }         
    );

    res.json({ token });
  } catch (error) {
    res.status(500).send('Login failed'); 
  }
}
module.exports = {
  handleUserSignup,
  handleUserLogin
};