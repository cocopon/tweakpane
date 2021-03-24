import {SingleValueEvents, ValueMap, ValueMapEvents} from '../model/value-map';
import {ClassName} from './class-name';

interface ViewPropsObject extends Record<string, unknown> {
	disabled: boolean;
	hidden: boolean;
}

export type ViewProps = ValueMap<ViewPropsObject>;
export type ViewPropsEvents = ValueMapEvents<ViewPropsObject>;

/**
 * A view interface.
 */
export interface View {
	/**
	 * A root element of the view.
	 */
	readonly element: HTMLElement;

	onDispose?(): void;
}

export function defaultViewProps(
	opt_initialValue?: Partial<ViewPropsObject>,
): ViewProps {
	const initialValue: Partial<ViewPropsObject> = opt_initialValue ?? {};
	return new ValueMap({
		disabled: initialValue.disabled ?? false,
		hidden: initialValue.hidden ?? false,
	});
}

const className = ClassName('');

function applyClass(elem: HTMLElement, className: string, active: boolean) {
	if (active) {
		elem.classList.add(className);
	} else {
		elem.classList.remove(className);
	}
}

function extractValue<T>(ev: SingleValueEvents<T>['change']): T {
	return ev.value;
}

function pipe<A, B, C>(
	h1: (input: A) => B,
	h2: (input: B) => C,
): (input: A) => C {
	return (input) => h2(h1(input));
}

function applyHiddenClass(elem: HTMLElement): (value: boolean) => void {
	return (value) => {
		applyClass(elem, className(undefined, 'hidden'), value);
	};
}

function applyDisabledClass(elem: HTMLElement): (value: boolean) => void {
	return (value) => {
		applyClass(elem, className(undefined, 'disabled'), value);
	};
}

function applyDisabled(
	elem: HTMLButtonElement | HTMLInputElement | HTMLSelectElement,
) {
	return (value: boolean) => {
		elem.disabled = value;
	};
}

export function bindViewProps(viewProps: ViewProps, elem: HTMLElement) {
	viewProps
		.valueEmitter('disabled')
		.on('change', pipe(extractValue, applyDisabledClass(elem)));
	applyDisabledClass(elem)(viewProps.get('disabled'));

	viewProps
		.valueEmitter('hidden')
		.on('change', pipe(extractValue, applyHiddenClass(elem)));
	applyHiddenClass(elem)(viewProps.get('hidden'));
}

export function bindDisabled(
	viewProps: ViewProps,
	elem: HTMLButtonElement | HTMLInputElement | HTMLSelectElement,
) {
	viewProps
		.valueEmitter('disabled')
		.on('change', pipe(extractValue, applyDisabled(elem)));
	applyDisabled(elem)(viewProps.get('disabled'));
}
