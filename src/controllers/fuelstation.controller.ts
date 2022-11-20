import { Request, Response } from 'express';
import { Fuelstation, FuelstationInput } from '../models/fuelstation.model';

// Function to create new fuelstation
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

  try {
    // Create new fuelstation
    const fuelstationCreated = await Fuelstation.create(fuelstationInput);

    return res.status(201).json({ data: fuelstationCreated });
  } catch (e) {
    const error = e as Error;

    if (error.name === 'ValidationError') {
      return res.status(400).send(error);
    }
    return res.status(500).send('Something went wrong');
  }
};

// Function to get all fuelstations
const getAllFuelstations = async (req: Request, res: Response) => {
  try {
    const fuelstations = await Fuelstation.find().populate('fuelstation').sort('-createdAt').exec();

    return res.status(200).json({ data: fuelstations });
  } catch (e) {
    return res.status(500).send('Something went wrong');
  }
};

// Function to get specific fuelstation
const getFuelstation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const fuelstation = await Fuelstation.findOne({ id }).populate('fuelstation').exec();

    if (!fuelstation) {
      return res.status(404).json({ message: `Fuelstation with id "${id}" not found.` });
    }

    return res.status(200).json({ data: fuelstation });
  } catch (e) {
    return res.status(500).send('Something went wrong');
  }
};

// Function to update specific fuelstations
// It will only update the name and the price of exisiting pumps
const updateFuelstation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, pumps } = req.body;

  try {
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
      await Fuelstation.updateOne({ id, 'pumps.id': pump.id }, { $set: { 'pumps.$.price': pump.price } });
    }

    const fuelstationUpdated = await Fuelstation.findOne({ id });

    return res.status(200).json({ data: fuelstationUpdated });
  } catch (e) {
    const error = e as Error;

    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).send(error);
    }
    return res.status(500).send('Something went wrong');
  }
};

// Function to delete specific fuelstation
const deleteFuelstation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Fuelstation.findOneAndDelete({ id });

    return res.status(200).json({ message: 'Fuelstation deleted successfully.' });
  } catch (e) {
    return res.status(500).send('Something went wrong');
  }
};

export { createFuelstation, getAllFuelstations, getFuelstation, updateFuelstation, deleteFuelstation };
