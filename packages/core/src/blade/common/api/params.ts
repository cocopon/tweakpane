import {Formatter} from '../../../common/converter/formatter.js';
import {
	BaseInputParams,
	BaseMonitorParams,
	BaseParams,
	ListParamsOptions,
	NumberTextInputParams,
	PickerLayout,
	PointDimensionParams,
} from '../../../common/params.js';
import {ColorType} from '../../../input-binding/color/model/color-model.js';

export interface BooleanInputParams extends BaseInputParams {
	options?: ListParamsOptions<boolean>;
}

export interface ColorInputParams extends BaseInputParams {
	color?: {
		alpha?: boolean;
		type?: ColorType;
	};
	expanded?: boolean;
	picker?: PickerLayout;
}

export interface NumberInputParams
	extends BaseInputParams,
		NumberTextInputParams {
	options?: ListParamsOptions<number>;
}

export interface Point2dYParams extends PointDimensionParams {
	inverted?: boolean;
}

export interface Point2dInputParams
	extends BaseInputParams,
		PointDimensionParams {
	expanded?: boolean;
	picker?: PickerLayout;
	x?: PointDimensionParams;
	y?: Point2dYParams;
}

export interface Point3dInputParams
	extends BaseInputParams,
		PointDimensionParams {
	x?: PointDimensionParams;
	y?: PointDimensionParams;
	z?: PointDimensionParams;
}

export interface Point4dInputParams
	extends BaseInputParams,
		PointDimensionParams {
	x?: PointDimensionParams;
	y?: PointDimensionParams;
	z?: PointDimensionParams;
	w?: PointDimensionParams;
}

export interface StringInputParams extends BaseInputParams {
	options?: ListParamsOptions<string>;
}

type InputParams =
	| BooleanInputParams
	| ColorInputParams
	| NumberInputParams
	| Point2dInputParams
	| Point3dInputParams
	| Point4dInputParams
	| StringInputParams;

export interface BooleanMonitorParams extends BaseMonitorParams {
	/**
	 * Number of rows for visual height.
	 */
	rows?: number;
}

export interface NumberMonitorParams extends BaseMonitorParams {
	format?: Formatter<number>;
	max?: number;
	min?: number;
	/**
	 * Number of rows for visual height.
	 */
	rows?: number;
}

export interface StringMonitorParams extends BaseMonitorParams {
	multiline?: boolean;
	/**
	 * Number of rows for visual height.
	 */
	rows?: number;
}

type MonitorParams =
	| BooleanMonitorParams
	| NumberMonitorParams
	| StringMonitorParams;

export type BindingParams = InputParams | MonitorParams;

export interface ButtonParams extends BaseParams {
	title: string;

	label?: string;
}

export interface FolderParams extends BaseParams {
	title: string;

	expanded?: boolean;
}

export interface TabParams extends BaseParams {
	pages: {
		title: string;
	}[];
}
