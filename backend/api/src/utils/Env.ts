import env from 'env-var';
import { StageValues, Stages } from '../../../lib/config/ConfigTypes';

enum EnvVars {
    'AUTH0_DOMAIN' = 'AUTH0_DOMAIN',
    'AIRTABLE_API_TOKEN' = 'AIRTABLE_API_TOKEN',
    'AIRTABLE_BASE_ID' = 'AIRTABLE_BASE_ID',
    'ENV' = 'ENV',
    'ALLOWED_ORIGINS' = 'ALLOWED_ORIGINS'
}

export class Env {
    public env: Stages;
    public allowedOrigins: string;

    constructor() {
        // TODO: separate lambda envs from compile envs
        this.allowedOrigins = env.get(EnvVars.ALLOWED_ORIGINS).required().asString();
        const envVar = env.get(EnvVars.ENV).required().asEnum(StageValues);
		this.env = Stages[envVar as keyof typeof Stages];
    }

    getAsEnv() {
        const { allowedOrigins, env } = this;
        
        return {
            // These variables will be processed into lambdas on the build step
            [EnvVars.ENV]: env,
            [EnvVars.ALLOWED_ORIGINS]: allowedOrigins,
        }
    }

    getAsVariable() {
        const { allowedOrigins, env } = this;
        return { allowedOrigins, env };
    }
}

export const envs = new Env();
export const lambdaEnvs = envs.getAsVariable();
