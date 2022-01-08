const router = require("express").Router();
const express = require("express");
const auth = require("../middleware/auth");
const { Equipment } = require("../models/equipment");
const { User } = require("../models/user");

router.get("", async (req, res) => {
  const equipmentList = await Equipment.find();
  return res.send(equipmentList);
});

router.post("/", [auth], async (req, res) => {
  try {
    const equipment = new Equipment({
      name: req.body.name,
      description: req.body.description,
      color: req.body.color,
      serialNumber: req.body.serialNumber,
    });
    await equipment.save();

    // Save it in the user's list
    const signedInUser = await User.findById(req.user._id);

    console.log("new equpment", equipment);
    console.log(signedInUser);
    signedInUser.myList.push(equipment._id);
    await signedInUser.save();

    return res.send(equipment);
  } catch (ex) {
    console.log(ex);
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.delete("/:equipmentId", async (req, res) => {
  const deleteEquipment = await Equipment.findById(req.params.equipmentId);
  await deleteEquipment.remove();
  return res.send();
});

router.put("/:equipmentId/isAvailable", [auth], async (req, res) => {
  try {
    console.log("here");
    console.log(req.params.equipmentId);
    const available = await Equipment.findByIdAndUpdate(
      req.params.equipmentId,
      {
        isAvailable: false,
        rentedAddress: req.user.address,
        lat: req.user.lat,
        lng: req.user.lng,
      }
    );
    res.json(available);
  } catch (exception) {
    console.log("Internal Server Error", exception);
  }
});

module.exports = router;
