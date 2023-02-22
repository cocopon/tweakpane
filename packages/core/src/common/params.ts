export interface BaseParams {
	disabled?: boolean;
	hidden?: boolean;
	index?: number;
}

export type ArrayStyleListOptions<T> = {text: string; value: T}[];
export type ObjectStyleListOptions<T> = {[text: string]: T};
export type ListParamsOptions<T> =
	| ArrayStyleListOptions<T>
	| ObjectStyleListOptions<T>;

export interface PointDimensionParams {
	max?: number;
	min?: number;
	step?: number;
}

export type PickerLayout = 'inline' | 'popup';

interface BindingParams extends BaseParams {
	label?: string;
	tag?: string | undefined;
	view?: string;
}

export interface BaseInputParams
	extends BindingParams,
		Record<string, unknown> {
	readonly?: false;
}

export interface BaseMonitorParams
	extends BindingParams,
		Record<string, unknown> {
	bufferSize?: number;
	interval?: number;
	readonly: true;
}

export interface BaseBladeParams extends BaseParams, Record<string, unknown> {}
