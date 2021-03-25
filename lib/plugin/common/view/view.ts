import {ValueMap, ValueMapEvents} from '../model/value-map';

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
