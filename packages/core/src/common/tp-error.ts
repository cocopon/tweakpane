import {forceCast} from '../misc/type-util';

interface ErrorContext {
	alreadydisposed: undefined;
	invalidparams: {name: string};
	nomatchingcontroller: {key: string};
	nomatchingview: {params: Record<string, unknown>};
	notbindable: undefined;
	propertynotfound: {name: string};
	shouldneverhappen: undefined;
}

type ErrorType = keyof ErrorContext;

interface Config<T extends ErrorType> {
	context?: ErrorContext[T];
	type: T;
}

type CreateMessage<T extends ErrorType> = (context: ErrorContext[T]) => string;

const CREATE_MESSAGE_MAP: {[key in ErrorType]: CreateMessage<key>} = {
	alreadydisposed: () => 'View has been already disposed',
	invalidparams: (context) => `Invalid parameters for '${context.name}'`,
	nomatchingcontroller: (context) =>
		`No matching controller for '${context.key}'`,
	nomatchingview: (context) =>
		`No matching view for '${JSON.stringify(context.params)}'`,
	notbindable: () => `Value is not bindable`,
	propertynotfound: (context) => `Property '${context.name}' not found`,
	shouldneverhappen: () => 'This error should never happen',
};

export class TpError<T extends ErrorType> {
	public static alreadyDisposed(): TpError<'alreadydisposed'> {
		return new TpError({type: 'alreadydisposed'});
	}

	public static notBindable(): TpError<'notbindable'> {
		return new TpError({
			type: 'notbindable',
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
		return new TpError({type: 'shouldneverhappen'});
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
