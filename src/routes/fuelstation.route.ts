import { Router } from 'express';
import { createFuelstation, getAllFuelstations, getFuelstation, updateFuelstation, deleteFuelstation } from '../controllers/fuelstation.controller';

const fuelstationRoute = () => {
  const router = Router();

  router.post('/fuelstations', createFuelstation);

  router.get('/fuelstations', getAllFuelstations);

  router.get('/fuelstations/:id', getFuelstation);

  router.patch('/fuelstations/:id', updateFuelstation);
  
  router.delete('/fuelstations/:id', deleteFuelstation);

  return router;
};

export { fuelstationRoute };