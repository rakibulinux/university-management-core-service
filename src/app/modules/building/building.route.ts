import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controller';
import { BuildingValidation } from './building.validation';
const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(BuildingValidation.createBuildingZodSchema),
  BuildingController.createBuilding
);
router.patch(
  '/:id',
  validateRequest(BuildingValidation.updateBuildingZodSchema),
  BuildingController.updateSingleBuilding
);
router.delete('/:id', BuildingController.deleteSingleBuilding);
router.get('/:id', BuildingController.getSingleBuilding);
router.get('/', BuildingController.getAllBuildings);

export const BuildingRoute = router;
