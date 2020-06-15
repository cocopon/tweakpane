interface BaseParams {
	index?: number;
}

interface LabelableParams {
	label?: string;
}

export interface InputParamsOption<T> {
	text: string;
	value: T;
}

export interface InputParamsOptionDictionary<T> {
	[key: string]: T;
}

export interface Point2dDimensionParams {
	max?: number;
	min?: number;
	step?: number;
}

export type Point2dXParams = Point2dDimensionParams;

export interface Point2dYParams extends Point2dDimensionParams {
	inverted?: boolean;
}

interface BaseInputParams extends BaseParams, LabelableParams {
	presetKey?: string;
}

interface BooleanInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
}

type NumberInputType = 'color' | 'color.rgb' | 'color.rgba';

interface NumberInputParams extends BaseInputParams {
	input?: NumberInputType;
	max?: number;
	min?: number;
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
	step?: number;
}

interface Point2dInputParams extends BaseInputParams {
	x?: Point2dXParams;
	y?: Point2dYParams;
}

interface StringInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
}

export type InputParams =
	| BooleanInputParams
	| NumberInputParams
	| Point2dInputParams
	| StringInputParams;

interface BaseMonitorParams extends BaseParams, LabelableParams {
	count?: number;
	interval?: number;
}

type BooleanMonitorParams = BaseMonitorParams;

type NumberMonitorViewType = 'graph';

interface NumberMonitorParams extends BaseMonitorParams {
	max?: number;
	min?: number;
	view?: NumberMonitorViewType;
}

interface StringMonitorParams extends BaseMonitorParams {
	multiline?: boolean;
}

export type MonitorParams =
	| BooleanMonitorParams
	| NumberMonitorParams
	| StringMonitorParams;

export interface ButtonParams extends BaseParams {
	title: string;
}

export interface FolderParams extends BaseParams {
	expanded?: boolean;
	title: string;
}

export type SeparatorParams = BaseParams;
