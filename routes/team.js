const express = require('express');
const router = express.Router();
const Team = require('../models/Team'); 

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Create Team
router.post('/', async (req, res) => {
    try {
      const newTeam = new Team({
        name: req.body.name,
        members: req.body.members,
      });
  
      await newTeam.save();
  
      res.status(201).json(newTeam);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Get Team Details
router.get('/:id', async (req, res) => {
    try {
      const team = await Team.findById(req.params.id).populate('members');
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.status(200).json(team);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;
