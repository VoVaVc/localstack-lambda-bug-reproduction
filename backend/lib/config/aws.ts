import env from 'env-var';
import dotenv from 'dotenv';
import { StageValues, Stages } from './ConfigTypes';

enum EnvVars {
	'AWS_ACCOUNT_ID' = 'AWS_ACCOUNT_ID',
	'AWS_ACCOUNT_REGION' = 'AWS_ACCOUNT_REGION',
	'ENV' = 'ENV',
	'CI' = 'CI',
}

if (process.env.CI !== 'true') {
	dotenv.config();
}

class AwsConfig {
	public accountId: string;
	public region: string;
	public env: Stages;
	public CI: boolean;

	constructor() {
		this.accountId = env.get(EnvVars.AWS_ACCOUNT_ID).required().asString();
		this.region = env.get(EnvVars.AWS_ACCOUNT_REGION).required().asString();
		const envVar = env.get(EnvVars.ENV).required().asEnum(StageValues);
		this.env = Stages[envVar as keyof typeof Stages];
		this.CI = env.get(EnvVars.CI).default('false').asBool();
	}
}

const aws = new AwsConfig();
export default aws;
