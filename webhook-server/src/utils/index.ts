import crypto from 'crypto';
import { Request } from 'express';
import safeCompare from 'safe-compare';
import { EASWebhookData } from '../types';
import axios from 'axios';
import AWS from 'aws-sdk';
import { IncomingWebhook } from '@slack/webhook';

const EAS_WEBHOOK_SECRET = process.env.EAS_WEBHOOK_SECRET!;
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!;

// AWS S3 Configuration
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
});

export async function verifySignature(req: Request): Promise<boolean> {
    const expoSignature = req.headers['expo-signature'] as string;
    const webhookData: EASWebhookData = req.body;
    const hmac = crypto.createHmac('sha1', EAS_WEBHOOK_SECRET);
    hmac.update(JSON.stringify(webhookData));
    const hash = `sha1=${hmac.digest('hex')}`;

    // Use safeCompare to prevent timing attacks
    return safeCompare(expoSignature, hash);
}

async function downloadFile(url: string): Promise<Buffer> {
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 300000, // 5 minutes timeout
        maxContentLength: 500 * 1024 * 1024, // 500MB max
    });
    return Buffer.from(response.data);
}

// Upload build artifacts to S3
async function uploadToS3(buffer: Buffer, key: string) {
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'application/octet-stream',
    }

    const result = await s3.upload(params).promise();
    return result.Location;
}

// Send Slack notification
async function sendSlackNotification(s3Url: string, platform: string) {
    
    const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

    await webhook.send({
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `🚀 *New ${platform} build is ready!*\nDownload: <${s3Url}|Click here>`,
                },
            },
        ]
    });
}

// Process the build
export async function processBuild(webhookData: EASWebhookData) {
    try {
        if (webhookData.artifacts?.buildUrl) {
            console.log(`Processing successful build: ${webhookData.id}`);

            // Download the artifact
            console.log('Downloading artifact from:', webhookData.artifacts?.buildUrl);
            const artifactBuffer = await downloadFile(webhookData.artifacts?.buildUrl);

            // Generate S3 key
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileExt = `${webhookData.artifacts.buildUrl.split('.')[webhookData.artifacts.buildUrl.split('.').length - 1]}`
            const s3Key = `builds/${webhookData.projectName}/${webhookData.platform}/${timestamp}.${fileExt}`

            // Upload to S3
            console.log('Uploading to S3 with key:', s3Key);
            const s3Url = await uploadToS3(artifactBuffer, s3Key);
            console.log('Upload successful, S3 URL:', s3Url);

            // Send Slack notification
            console.log('Sending Slack notification...');
            await sendSlackNotification(s3Url, webhookData.platform);
            console.log('Slack notification sent successfully.');
        }        
    } catch (error) {
        console.error('Error processing successful build:', error);
        // Log the error but don't throw - this runs in background
    }
}