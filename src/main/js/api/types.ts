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

interface BaseInputParams {
	label?: string;
	presetKey?: string;
}

interface BooleanInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
}

type NumberInputType = 'rgb';

interface NumberInputParams extends BaseInputParams {
	input?: NumberInputType;
	max?: number;
	min?: number;
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
	step?: number;
}

interface Point2dInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
	x?: Point2dDimensionParams;
	y?: Point2dDimensionParams;
}

interface StringInputParams extends BaseInputParams {
	options?: InputParamsOption<unknown>[] | InputParamsOptionDictionary<unknown>;
}

export type InputParams =
	| BooleanInputParams
	| NumberInputParams
	| Point2dInputParams
	| StringInputParams;

interface BaseMonitorParams {
	count?: number;
	interval?: number;
	label?: string;
}

type BooleanMonitorParams = BaseMonitorParams;

interface NumberMonitorParams extends BaseMonitorParams {
	max?: number;
	min?: number;
	type?: string;
}

interface StringMonitorParams extends BaseMonitorParams {
	multiline?: boolean;
}

export type MonitorParams =
	| BooleanMonitorParams
	| NumberMonitorParams
	| StringMonitorParams;

export interface ButtonParams {
	title: string;
}

export interface FolderParams {
	expanded?: boolean;
	title: string;
}
