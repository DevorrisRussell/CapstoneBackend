const router = require("express").Router();
const express = require('express');
const auth = require("../middleware/auth");
const { Equipment } = require("../models/equipment");

router.get('', async (req, res) => {
    const equipmentList = await Equipment.find();
    return res.send(equipmentList);
});

router.post('/:equipment', async (req, res) => {
    try {
        const equipment = new Equipment({
            name: req.body.name,
            description: req.body.description,
            
          });
        await equipment.save();

        return res.send(equipment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.delete("/:equipmentId", async (req, res) => {
    const deleteEquipment = await Equipment.findById(req.params.equipmentId)
    await deleteEquipment.remove();
    return res.send();
});

router.put("/:equipmentId/isAvailable", [auth], async (req,res)=>{
   const available = await Equipment.findByIdAndUpdate(req.params.equipmentId.isAvailable);
    const equipmentAvailable = req.body.isAvailable
   return res.send(available)
   
});


module.exports = router;