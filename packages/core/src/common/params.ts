import {Formatter} from './converter/formatter.js';

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

export interface NumberTextInputParams {
	format?: Formatter<number>;
	/**
	 * The unit scale for key input.
	 */
	keyScale?: number;
	max?: number;
	min?: number;
	/**
	 * The unit scale for pointer input.
	 */
	pointerScale?: number;
	step?: number;
}

export type PointDimensionParams = NumberTextInputParams;
