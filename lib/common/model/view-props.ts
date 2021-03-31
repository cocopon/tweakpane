import {ValueMap, ValueMapEvents} from './value-map';

export interface ViewPropsObject extends Record<string, unknown> {
	disabled: boolean;
	hidden: boolean;
}

export type ViewProps = ValueMap<ViewPropsObject>;
export type ViewPropsEvents = ValueMapEvents<ViewPropsObject>;

export function createViewProps(
	opt_initialValue?: Partial<ViewPropsObject>,
): ViewProps {
	const initialValue: Partial<ViewPropsObject> = opt_initialValue ?? {};
	return new ValueMap({
		disabled: initialValue.disabled ?? false,
		hidden: initialValue.hidden ?? false,
	});
}
