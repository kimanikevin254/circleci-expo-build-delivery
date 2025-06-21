import express, { Request, Response } from 'express';
import 'dotenv/config'

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/webhook', async (req: Request, res: Response) => {
    res.status(200).send('Webhook received');
});

export default app;