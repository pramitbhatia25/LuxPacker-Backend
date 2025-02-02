import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import authRoutes from './routes/auth.route.js';
import dataRoutes from "./routes/fetch.route.js";
import razorpayRoutes from "./routes/razorpay.route.js"

dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Allows us to accept JSON data in the body of the request
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Worlasde1s2!');
});

app.get('/a', (req, res) => {
  res.send('Hello a!');
});


app.use("/v1", authRoutes);
app.use("/v1/fetchData", dataRoutes);
app.use("/v1/razorpay", razorpayRoutes);

export default app;