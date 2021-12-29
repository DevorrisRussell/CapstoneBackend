const { User, validateLogin, validateUser } = require("../models/user");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const bcrypt = require("bcrypt");
const express = require("express");
const { Equipment, equipmentSchema } = require("../models/equipment");
const router = express.Router();


//* POST register a new user
router.post("/register", async (req, res) =>
{
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send(`Email ${req.body.email} already claimed!`);

    const salt = await bcrypt.genSalt(10);
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      isAdmin: req.body.isAdmin,
    });

    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
router.get("/current", [auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.send (user);
})



//* POST a valid login attempt
//! when a user logs in, a new JWT token is generated and sent if their email/password credentials are correct
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* DELETE a single user from the database
router.delete("/:userId", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    await user.remove();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
//post user equipment


router.post('/current/myList', [auth], async (req, res) => {
  try {
      const signedInUser = await User.findById(req.user._id);

      const equipmentToBeAdded= new Equipment({
          name: req.body.name,
          description: req.body.description,
          
        });
        await equipmentToBeAdded.save();
        console.log(signedInUser);
        signedInUser.myList.push(equipmentToBeAdded._id);
      await signedInUser.save();

      return res.send(signedInUser);
  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get('/current/myList/', async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    const myEquipmentObjects = []

    for (let i =0; i< user.myList.length; i++){
      if(user.myList[i].isAccepted == 'ACCEPTED'){
        const theList = await User.findById(user.myList[i].myListId)
        myEquipmentObjects.push(theList);
      }
    }
    
    return res.send(myEquipmentObjects);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


module.exports = router;
