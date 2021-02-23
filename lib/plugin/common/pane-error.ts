type ErrorType =
	| 'alreadydisposed'
	| 'emptyvalue'
	| 'invalidparams'
	| 'nomatchingcontroller'
	| 'propertynotfound'
	| 'shouldneverhappen';

type Config =
	| {
			type: 'alreadydisposed';
	  }
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
	  }
	| {
			context: {name: string};
			type: 'propertynotfound';
	  }
	| {
			type: 'shouldneverhappen';
	  };

function createMessage(config: Config): string {
	if (config.type === 'alreadydisposed') {
		return 'View has been already disposed';
	}
	if (config.type === 'emptyvalue') {
		return `Value is empty for '${config.context.key}'`;
	}
	if (config.type === 'invalidparams') {
		return `Invalid parameters for '${config.context.name}'`;
	}
	if (config.type === 'nomatchingcontroller') {
		return `No matching controller for '${config.context.key}'`;
	}
	if (config.type === 'propertynotfound') {
		return `Property '${config.context.name}' not found`;
	}
	if (config.type === 'shouldneverhappen') {
		return 'This error should never happen';
	}
	return 'Unexpected error';
}

export class PaneError {
	public static alreadyDisposed(): PaneError {
		return new PaneError({type: 'alreadydisposed'});
	}

	public static propertyNotFound(name: string): PaneError {
		return new PaneError({
			type: 'propertynotfound',
			context: {
				name: name,
			},
		});
	}

	public static shouldNeverHappen(): PaneError {
		return new PaneError({type: 'shouldneverhappen'});
	}

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
