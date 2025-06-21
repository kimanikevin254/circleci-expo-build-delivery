import express, { Request, Response } from 'express';
import { EASWebhookData } from './types';
import 'dotenv/config'
import { processBuild, verifySignature } from './utils';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/webhook', async (req: Request, res: Response) => {
    try {
        // Verify the webhook signature
        if (!verifySignature(req)) {
            console.error('Webhook signature verification failed');
            res.status(401).send("Signatures didn't match!");
        } else {
            // Signature verification passed - return 200 immediately
            console.log('Webhook signature verified successfully');
            res.send('OK!');

            // Process the build asynchronously without affecting the response
            const webhookData: EASWebhookData = req.body;
            if (webhookData.status === 'finished' && webhookData.artifacts?.buildUrl) {
                // Don't await this - let it run in background
                processBuild(webhookData).catch(error => {
                    console.error('Background build processing failed:', error);
                });
            } else {
                // Log non-successful builds for monitoring
                let message = `Build ${webhookData.id} status: ${webhookData.status}`;
                
                if (webhookData.status === 'errored' && webhookData.error) {
                    message += ` - Error: ${webhookData.error.message}`;
                    console.log('Build failed:', webhookData.error);
                } else if (webhookData.status === 'canceled') {
                    message += ' - Build was canceled';
                    console.log('Build was canceled');
                } else if (webhookData.status === 'finished' && !webhookData.artifacts?.buildUrl) {
                    message += ' - No build artifacts available';
                    console.log('Build finished but no artifacts available');
                }
                
                console.log(message);
            }
        }

    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default app;