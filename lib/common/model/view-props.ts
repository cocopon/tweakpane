import {ValueMap, ValueMapEvents} from './value-map';

export type ViewPropsObject = {
	disabled: boolean;
	disposed: boolean;
	hidden: boolean;
};

export type ViewProps = ValueMap<ViewPropsObject>;
export type ViewPropsEvents = ValueMapEvents<ViewPropsObject>;

export function createViewProps(
	opt_initialValue?: Partial<ViewPropsObject>,
): ViewProps {
	const initialValue: Partial<ViewPropsObject> = opt_initialValue ?? {};
	return ValueMap.fromObject<ViewPropsObject>({
		disabled: initialValue.disabled ?? false,
		disposed: false,
		hidden: initialValue.hidden ?? false,
	});
}
