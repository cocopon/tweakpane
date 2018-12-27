type ErrorType = 'emptyvalue' | 'invalidparams' | 'nomatchingcontroller';

type Config =
	| {
			context: {key: string};
			type: 'emptyvalue';
	  }
	| {
			context: {name: string};
			type: 'invalidparams';
	  }
	| {
			context: {key: string};
			type: 'nomatchingcontroller';
	  };

function createMessage(config: Config): string {
	if (config.type === 'emptyvalue') {
		return `Value is empty for ${config.context.key}`;
	}
	if (config.type === 'invalidparams') {
		return `Invalid parameters for ${config.context.name}`;
	}
	if (config.type === 'nomatchingcontroller') {
		return `No matching controller for ${config.context.key}`;
	}
	return 'Unexpected error';
}

export default class PaneError {
	public readonly message: string;
	public readonly name: string;
	public readonly stack?: string;
	public readonly type: ErrorType;

	constructor(config: Config) {
		this.message = createMessage(config);

		this.name = this.constructor.name;
		this.stack = new Error(this.message).stack;
		this.type = config.type;
	}
}
(PaneError as any).prototype = Object.create(Error.prototype);
(PaneError.prototype as any).constructor = PaneError;
