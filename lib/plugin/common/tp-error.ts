import {forceCast} from '../../misc/type-util';

interface ErrorContext {
	alreadydisposed: {};
	emptyvalue: {key: string};
	invalidparams: {name: string};
	nomatchingcontroller: {key: string};
	propertynotfound: {name: string};
	shouldneverhappen: {};
}

type ErrorType = keyof ErrorContext;

interface Config<T extends ErrorType> {
	context: ErrorContext[T];
	type: T;
}

type CreateMessage<T extends ErrorType> = (context: ErrorContext[T]) => string;

const CREATE_MESSAGE_MAP: {[key in ErrorType]: CreateMessage<key>} = {
	alreadydisposed(_context) {
		return 'View has been already disposed';
	},
	emptyvalue(context) {
		return `Value is empty for '${context.key}'`;
	},
	invalidparams(context) {
		return `Invalid parameters for '${context.name}'`;
	},
	nomatchingcontroller(context) {
		return `No matching controller for '${context.key}'`;
	},
	propertynotfound(context) {
		return `Property '${context.name}' not found`;
	},
	shouldneverhappen(_context) {
		return 'This error should never happen';
	},
};

export class TpError<T extends ErrorType> {
	public static alreadyDisposed(): TpError<'alreadydisposed'> {
		return new TpError({context: {}, type: 'alreadydisposed'});
	}

	public static valueIsEmpty(key: string): TpError<'emptyvalue'> {
		return new TpError({
			context: {
				key: key,
			},
			type: 'emptyvalue',
		});
	}

	public static propertyNotFound(name: string): TpError<'propertynotfound'> {
		return new TpError({
			type: 'propertynotfound',
			context: {
				name: name,
			},
		});
	}

	public static shouldNeverHappen(): TpError<'shouldneverhappen'> {
		return new TpError({context: {}, type: 'shouldneverhappen'});
	}

	public readonly message: string;
	public readonly name: string;
	public readonly stack?: string;
	public readonly type: ErrorType;

	constructor(config: Config<T>) {
		this.message =
			CREATE_MESSAGE_MAP[config.type](forceCast(config.context)) ??
			'Unexpected error';

		this.name = this.constructor.name;
		this.stack = new Error(this.message).stack;
		this.type = config.type;
	}
}
(TpError as any).prototype = Object.create(Error.prototype);
(TpError.prototype as any).constructor = TpError;
