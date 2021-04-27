import {ValueMap, ValueMapEvents} from './value-map';

export interface ViewPropsObject extends Record<string, unknown> {
	disabled: boolean;
	disposed: boolean;
	hidden: boolean;
}

export type ViewProps = ValueMap<ViewPropsObject>;
export type ViewPropsEvents = ValueMapEvents<ViewPropsObject>;

export function createViewProps(
	opt_initialValue?: Partial<ViewPropsObject>,
): ViewProps {
	const initialValue: Partial<ViewPropsObject> = opt_initialValue ?? {};
	return ValueMap.fromObject({
		disabled: initialValue.disabled ?? false,
		disposed: false as boolean,
		hidden: initialValue.hidden ?? false,
	});
}
