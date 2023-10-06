import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Duration } from 'aws-cdk-lib';
import AwsConfig from '../config/aws';
import { Stages } from '../config/ConfigTypes';


type CreateRestApiLambdaConfig = {
	fileName?: string;
	lockFile?: string;
	exportedHandlerName?: string;
	envs?: { [key: string]: string };
	handlersDirectory?: string;
};

export const LambdaFactory = (
	scope: Construct,
	name: string,
	filePath: string,
	{
		lockFile = 'package-lock.json',
		exportedHandlerName = 'lambda',
		handlersDirectory = 'src/lambdas',
		envs,
	}: CreateRestApiLambdaConfig = {}
) => {
	const { env } = AwsConfig;
	const nameWithEnv = `rb_portals_lambda_${name}_${env}`;
	const projectPath = path.resolve('api/');
	const fullPath = `${projectPath}/${handlersDirectory}/${filePath}`;

	const lambdaParams: NodejsFunctionProps = {
		entry: path.resolve(fullPath),
		functionName: nameWithEnv,
		handler: exportedHandlerName,
		depsLockFilePath: `${projectPath}/${lockFile}`,
		runtime: Runtime.NODEJS_18_X,
		// Enable logs for staging and prod environments
		logRetention: [Stages.prod, Stages.stg].includes(AwsConfig.env)
			? RetentionDays.ONE_WEEK
			: undefined,
		bundling: {
			minify: true,
			sourceMap: false,
			forceDockerBundling: false,
		},
		timeout: Duration.minutes(3),
		environment: envs,
	};

	return new NodejsFunction(scope, nameWithEnv, lambdaParams);
};
