import { Request, Response } from 'express';

import { Fuelstation, FuelstationInput } from '../models/fuelstation.model';

const createFuelstation = async (req: Request, res: Response) => {
  const { address, city, id, latitude, longitude, name, pumps } = req.body;

  if (!id || !name || !address || !city || !latitude || !longitude) {
    return res.status(422).json({ message: 'The fields id, name, address, city, latitude, and longitude are required' });
  }

  const fuelstation = await Fuelstation.findOne({ id }).populate('fuelstation').exec();

  if (fuelstation) {
    return res.status(404).json({ message: `Fuelstation with id "${id}" already exists.` });
  }

  const fuelstationInput: FuelstationInput = {
    id,
    name,
    address,
    city,
    latitude,
    longitude,
    pumps,
  };

  const fuelstationCreated = await Fuelstation.create(fuelstationInput);

  return res.status(201).json({ data: fuelstationCreated });
};

const getAllFuelstations = async (req: Request, res: Response) => {
  const fuelstations = await Fuelstation.find().populate('fuelstation').sort('-createdAt').exec();

  return res.status(200).json({ data: fuelstations });
};

const getFuelstation = async (req: Request, res: Response) => {
  const { id } = req.params;

  const fuelstation = await Fuelstation.findOne({ id }).populate('fuelstation').exec();

  if (!fuelstation) {
    return res.status(404).json({ message: `Fuelstation with id "${id}" not found.` });
  }

  return res.status(200).json({ data: fuelstation });
};

const updateFuelstation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, pumps } = req.body;

  const fuelstation = await Fuelstation.findOne({ id });

  if (!fuelstation) {
    return res.status(404).json({ message: `Fuelstation with id "${id}" not found.` });
  }

  if (!name || !pumps) {
    return res.status(422).json({ message: 'The fields "name" and "pumps" are required' });
  }

  // Update name
  await Fuelstation.updateOne({ id }, { name });

  // Update pump prices
  for (const pump of pumps) {
    console.log(await Fuelstation.updateOne({ id, 'pumps.id': pump.id }, { $set: { 'pumps.$.price': pump.price } }));
  }

  const fuelstationUpdated = await Fuelstation.findOne({ id });

  return res.status(200).json({ data: fuelstationUpdated });
};

const deleteFuelstation = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Fuelstation.findOneAndDelete({ id });

  return res.status(200).json({ message: 'Fuelstation deleted successfully.' });
};

export { createFuelstation, getAllFuelstations, getFuelstation, updateFuelstation, deleteFuelstation };
