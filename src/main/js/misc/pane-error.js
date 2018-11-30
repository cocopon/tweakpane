// @flow

type ErrorType = 'invalidparams' | 'nomatchingcontroller';

type Config =
	| {
			context: {name: string},
			type: 'invalidparams',
	  }
	| {
			context: {key: string},
			type: 'nomatchingcontroller',
	  };

function createMessage(config: Config): string {
	if (config.type === 'invalidparams') {
		return `Invalid parameters for ${config.context.name}`;
	}
	if (config.type === 'nomatchingcontroller') {
		return `No matching controller for ${config.context.key}`;
	}
	return 'Unexpected error';
}

export default class PaneError {
	+message: string;
	+name: string;
	+stack: string;
	+type: ErrorType;

	constructor(config: Config) {
		this.message = createMessage(config);

		this.name = this.constructor.name;
		this.stack = new Error(this.message).stack;
		this.type = config.type;
	}
}
(PaneError: any).prototype = Object.create(Error.prototype);
(PaneError.prototype: any).constructor = PaneError;
