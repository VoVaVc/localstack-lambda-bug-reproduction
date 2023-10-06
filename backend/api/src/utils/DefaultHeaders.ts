import { lambdaEnvs } from './Env';

export const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': lambdaEnvs.allowedOrigins,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,auth',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
}
