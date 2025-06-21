export interface EASWebhookData {
    id: string;
    accountName: string;
    projectName: string;
    buildDetailsPageUrl: string;
    parentBuildId?: string;
    appId: string;
    initiatingUserId: string;
    cancelingUserId?: string;
    platform: 'android' | 'ios';
    status: 'finished' | 'errored' | 'canceled';
    artifacts?: {
        buildUrl?: string;
        logsS3KeyPrefix: string;
    };
    metadata: {
        appName: string;
        username: string;
        workflow: string;
        appVersion: string;
        appBuildVersion: string;
        buildProfile: string;
        distribution: string;
        appIdentifier: string;
        gitCommitHash?: string;
        gitCommitMessage?: string;
        runtimeVersion?: string;
        [key: string]: any;
    };
    error?: {
        message: string;
        errorCode: string;
    };
    createdAt: string;
    completedAt?: string;
    [key: string]: any;
}