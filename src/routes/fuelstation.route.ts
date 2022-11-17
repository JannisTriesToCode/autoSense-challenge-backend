import { Router } from 'express';
import { createFuelstation, getAllFuelstations } from '../controllers/fuelstation.controller';

const fuelstationRoute = () => {
  const router = Router();

  router.post('/fuelstations', createFuelstation);

  router.get('/fuelstations', getAllFuelstations);

  return router;
};

export { fuelstationRoute };