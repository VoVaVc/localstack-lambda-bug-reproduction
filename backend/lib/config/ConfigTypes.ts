export enum Stages {
	'local' = 'local',
	'dev' = 'dev',
	'stg' = 'stg',
	'prod' = 'prod',
}

export const StageValues: string[] = Object.values(Stages) as string[];
