import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './databaseConnection';
import { fuelstationRoute } from './routes/fuelstation.route'

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

const swaggerAutogen = require('swagger-autogen')()
const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/fuelstation.route.ts']
swaggerAutogen(outputFile, endpointsFiles)
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./../swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use((req, res, next) => {
  const apiKey = req.get('API-Key')
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({error: 'Unauthorised'})
  } else {
    next()
  }
})

app.use('/', fuelstationRoute());

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
