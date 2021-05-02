import {Formatter} from '../../../common/converter/formatter';

interface BaseParams {
	disabled?: boolean;
	hidden?: boolean;
	index?: number;
}

interface LabelableParams {
	label?: string;
}

export type ArrayStyleListOptions<T> = {text: string; value: T}[];
export type ObjectStyleListOptions<T> = {[text: string]: T};

export interface PointDimensionParams {
	max?: number;
	min?: number;
	step?: number;
}

export interface Point2dYParams extends PointDimensionParams {
	inverted?: boolean;
}

export interface BaseInputParams extends BaseParams, LabelableParams {
	presetKey?: string;
	view?: string;
}

export type PickerLayout = 'inline' | 'popup';

export interface BooleanInputParams extends BaseInputParams {
	options?: ArrayStyleListOptions<boolean> | ObjectStyleListOptions<boolean>;
}

export interface NumberInputParams extends BaseInputParams {
	format?: Formatter<number>;
	max?: number;
	min?: number;
	options?: ArrayStyleListOptions<number> | ObjectStyleListOptions<number>;
	step?: number;
}

// TODO: Use `view` instead
type ColorInputType = 'color' | 'color.rgb' | 'color.rgba';

export interface ColorInputParams extends BaseInputParams {
	expanded?: boolean;
	input?: ColorInputType;
	picker?: PickerLayout;
}

export interface Point2dInputParams extends BaseInputParams {
	expanded?: boolean;
	picker?: PickerLayout;
	x?: PointDimensionParams;
	y?: Point2dYParams;
}

export interface Point3dInputParams extends BaseInputParams {
	x?: PointDimensionParams;
	y?: PointDimensionParams;
	z?: PointDimensionParams;
}

export interface Point4dInputParams extends BaseInputParams {
	x?: PointDimensionParams;
	y?: PointDimensionParams;
	z?: PointDimensionParams;
	w?: PointDimensionParams;
}

// TODO: Use `view` instead
export type StringInputType = 'string';

export interface StringInputParams extends BaseInputParams {
	input?: StringInputType;
	options?: ArrayStyleListOptions<string> | ObjectStyleListOptions<string>;
}

export type InputParams =
	| BooleanInputParams
	| ColorInputParams
	| NumberInputParams
	| Point2dInputParams
	| Point3dInputParams
	| Point4dInputParams
	| StringInputParams;

export interface BaseMonitorParams extends BaseParams, LabelableParams {
	bufferSize?: number;
	interval?: number;
	view?: string;
}

export interface BooleanMonitorParams extends BaseMonitorParams {
	lineCount?: number;
}

export interface NumberMonitorParams extends BaseMonitorParams {
	lineCount?: number;
	max?: number;
	min?: number;
}

export interface StringMonitorParams extends BaseMonitorParams {
	lineCount?: number;
	multiline?: boolean;
}

export type MonitorParams =
	| BooleanMonitorParams
	| NumberMonitorParams
	| StringMonitorParams;

export interface ButtonParams extends BaseParams, LabelableParams {
	title: string;
}

export interface FolderParams extends BaseParams {
	title: string;

	expanded?: boolean;
}

export type SeparatorParams = BaseParams;

export interface BladeParams extends BaseParams, Record<string, unknown> {}

export interface TabParams extends BaseParams {
	pages: {
		title: string;
	}[];
}
