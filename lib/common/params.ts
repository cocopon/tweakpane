export interface BaseParams {
	disabled?: boolean;
	hidden?: boolean;
	index?: number;
}

export interface LabelableParams {
	label?: string;
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

export interface BaseInputParams
	extends BaseParams,
		LabelableParams,
		Record<string, unknown> {
	presetKey?: string;
	view?: string;
}

export interface BaseMonitorParams
	extends BaseParams,
		LabelableParams,
		Record<string, unknown> {
	bufferSize?: number;
	interval?: number;
	view?: string;
}

export interface BladeParams extends BaseParams, Record<string, unknown> {}
