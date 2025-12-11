import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { createGroupController, getGroupController } from '../controllers/group.controller.js';
import { getGroupsByUserEmail } from '../controllers/group.controller.js';  

const router = express.Router();


router.get("/check", (req, res) => {
  res.json({ message: "Group routes are working!" });
});
router.get("/user/:email", getGroupsByUserEmail);
// All routes are protected by auth
router.post('/', auth, createGroupController);      // create a new group
router.get('/:id', auth, getGroupController);       // get group by id with members

export default router;

