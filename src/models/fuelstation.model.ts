import mongoose, { Schema, Model, Document } from 'mongoose';

const pumpSchema = new Schema(
    {
      id: {
          type: Schema.Types.String,
          required: true,
      },
      fuel_type: {
          type: Schema.Types.String,
          required: true,      
      },
      price: {
          type: Schema.Types.String,
          required: true,
      },
      available: {
          type: Schema.Types.Boolean,
          required: true,  
      },
    },
    {
      timestamps: true,
    },
  );

type FuelstationDocument = Document & {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  pumps: Schema;
};

type FuelstationInput = {
    id: FuelstationDocument['id'];
    name: FuelstationDocument['name'];
    address: FuelstationDocument['address'];
    city: FuelstationDocument['city'];
    latitude: FuelstationDocument['latitude'];
    longitude: FuelstationDocument['longitude'];
    pumps: FuelstationDocument['pumps'];
};

const fuelstationSchema = new Schema(
  {
    id: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    name: {
        type: Schema.Types.String,
        required: true,      
    },
    address: {
        type: Schema.Types.String,
        required: true,
    },
    city: {
        type: Schema.Types.String,
        required: true,  
    },
    latitude: {
        type: Schema.Types.String,
        required: true,  
    },
    longitude: {
        type: Schema.Types.String,
        required: true,  
    },
    pumps: {
        type: [pumpSchema],
        required: false,
    }
  },
  {
    collection: 'fuelstations',
    timestamps: true,
  },
);

const Fuelstation: Model<FuelstationDocument> = mongoose.model<FuelstationDocument>('Fuelstation', fuelstationSchema);

export { Fuelstation, FuelstationInput, FuelstationDocument };