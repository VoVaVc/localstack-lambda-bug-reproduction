import { Duration, Tags } from 'aws-cdk-lib';
import AwsConfig from '../config/aws';
import {
	RestApi,
	LogGroupLogDestination,
	Cors,
	LambdaIntegration,
	TokenAuthorizer,
	AuthorizationType,
} from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { LambdaFactory } from '../factories/lambda';
import { envs } from '../../api/src/utils/Env';
import { Stages } from '../config/ConfigTypes';

export class Api extends RestApi {
	private authorizer: TokenAuthorizer | undefined;
	constructor(scope: Construct, allowOrigins: string[]) {
		const { env } = AwsConfig;
		const portalName = 'backend';
		const apiId = `${portalName}_apigw_endpoint_${env}`;
		const log = new LogGroupLogDestination(
			new LogGroup(scope, `${portalName}_apiloggroup_${env}`)
		);

		super(scope, apiId, {
			restApiName: `${portalName}_${env}`,
			cloudWatchRole: true,
			deployOptions: {
				stageName: String(env),
				accessLogDestination: log,
			},
			defaultCorsPreflightOptions: {
				allowCredentials: true,
				allowOrigins,
				allowHeaders: [...Cors.DEFAULT_HEADERS, 'auth'],
				allowMethods: Cors.ALL_METHODS,
			},
		});

		if (env !== Stages.local) {
			this.authorizer = new TokenAuthorizer(scope, `tokenAuthorizer_${env}`, {
				handler: LambdaFactory(this, 'Authorizer', 'Authorizer/Authorizer.ts', { envs: envs.getAsEnv() }),
				authorizerName: `token_authorizer_${env}`,
				resultsCacheTtl: Duration.minutes(0),
				identitySource: 'method.request.header.auth',
			});
		} else {
			// Fixed route id for local dev:
			// https://docs.localstack.cloud/user-guide/aws/apigateway/#custom-ids-for-api-gateway-resources-via-tags
			Tags.of(scope).add('_custom_id_', 'api');
		}
	}

	addEndpoint(path: string, lambda: NodejsFunction) {
		const usablePath = path.replace(/^\//, '');

		const resource = this.root.addResource(usablePath);

		const integration = new LambdaIntegration(lambda);

		const authorizationType = this.authorizer
			? AuthorizationType.CUSTOM
			: AuthorizationType.NONE;

		resource.addMethod('ANY', integration, {
			authorizationType,
			authorizer: this.authorizer,
		});

		resource.addProxy({
			defaultIntegration: integration,
		});
	}
}
