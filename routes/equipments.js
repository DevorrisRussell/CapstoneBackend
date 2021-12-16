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

router.delete("/:equipment_id", [auth], async (req, res) => {
    const deleteEquipment = await equipment_id.findById(req.params.equipment_id);
    await equipment_id.remove();
    return res.send();
});






module.exports = router;