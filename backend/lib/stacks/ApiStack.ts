import { Api } from '../api/RestApi';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaFactory } from '../factories/lambda';
import { envs } from '../../api/src/utils/Env';
import AwsConfig from '../config/aws';
import { SecurityPolicy } from 'aws-cdk-lib/aws-apigateway';
import { Stages } from '../config/ConfigTypes';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';

class ApiStack extends Stack {
	constructor(scope: Construct, id: string, domainName: string, allowedOrigins: string[], props: StackProps) {
		super(scope, id, props);

		const { env } = AwsConfig;
		const api = new Api(this, allowedOrigins);

		const certificate = new Certificate(this, domainName, {
			domainName: domainName,
			validation: CertificateValidation.fromDns(),
		});

		// Walk through routes and create necessary apis
		const lambdaEnvs = { 
			envs: {
				...envs.getAsEnv(),
				'ALLOWED_ORIGINS': allowedOrigins.join(','),
			}
		};
		api.addEndpoint('/healthcheck', LambdaFactory(this, 'HealthCheck', 'HealthCheck/HealthCheck.ts', lambdaEnvs));
		api.addEndpoint('/healthcheck-copy', LambdaFactory(this, 'HealthCheckCopy', 'HealthCheck/HealthCheck.ts', lambdaEnvs));
		api.addEndpoint('/healthcheck-copy-2', LambdaFactory(this, 'HealthCheckCopy2', 'HealthCheck/HealthCheck.ts', lambdaEnvs));
		api.addEndpoint('/healthcheck-copy-3', LambdaFactory(this, 'HealthCheckCopy3', 'HealthCheck/HealthCheck.ts', lambdaEnvs));

		if (env !== Stages.local) {
			// assign domain name to the api
			api.addDomainName("domain_name", {
				domainName: domainName,
				securityPolicy: SecurityPolicy.TLS_1_2,        
				certificate,
			});
		}
	}
}

export default ApiStack;
