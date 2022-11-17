import { Request, Response } from 'express';

import { Fuelstation, FuelstationInput } from '../models/fuelstation.model';

const createFuelstation = async (req: Request, res: Response) => {
  const { id, name, address, city, latitude, longitude, pumps } = req.body;

  if (!id || !name || !address || !city || !latitude || !longitude) {
    return res.status(422).json({ message: 'The fields id, name, address, city, latitude, and longitude are required' });
  }

  const fuelstationInput: FuelstationInput = {
    id,
    name,
    address,
    city,
    latitude,
    longitude,
    pumps
  };

  const fuelstationCreated = await Fuelstation.create(fuelstationInput);

  return res.status(201).json({ data: fuelstationCreated });
};

const getAllFuelstations = async (req: Request, res: Response) => {
  const fuelstations = await Fuelstation.find().populate('fuelstation').sort('-createdAt').exec();

  return res.status(200).json({ data: fuelstations });
};

export { createFuelstation, getAllFuelstations };