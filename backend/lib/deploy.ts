import { App } from 'aws-cdk-lib';
import AwsConfig from './config/aws';
import ApiStack from './stacks/ApiStack';
import { Stages } from './config/ConfigTypes';

const app = new App();
const { env } = AwsConfig;

const stackEnv = {
	account: String(AwsConfig.accountId),
	region: AwsConfig.region,
};

const stackName = `api-stack-${AwsConfig.env}`;
const apiDomainName = 'somedomain.com';

const allowedOrigns = env !== Stages.local ? [] : ['localstack:3000'];

new ApiStack(app, stackName, apiDomainName, allowedOrigns, {
	stackName,
	env: stackEnv
});
