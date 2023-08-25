import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validation';
const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoomValidation.createRoomZodSchema),
  RoomController.createRoom
);
router.patch(
  '/:id',
  validateRequest(RoomValidation.updateRoomZodSchema),
  RoomController.updateSingleRoom
);
router.delete('/:id', RoomController.deleteSingleRoom);
router.get('/:id', RoomController.getSingleRoom);
router.get('/', RoomController.getAllRooms);

export const RoomRoute = router;
