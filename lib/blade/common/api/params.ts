import {BaseParams} from '../../../common/params';
import {BooleanInputParams} from '../../../input-binding/boolean/plugin';
import {ColorInputParams} from '../../../input-binding/color/util';
import {NumberInputParams} from '../../../input-binding/number/plugin';
import {Point2dInputParams} from '../../../input-binding/point-2d/plugin';
import {Point3dInputParams} from '../../../input-binding/point-3d/plugin';
import {Point4dInputParams} from '../../../input-binding/point-4d/plugin';
import {StringInputParams} from '../../../input-binding/string/plugin';
import {BooleanMonitorParams} from '../../../monitor-binding/boolean/plugin';
import {NumberMonitorParams} from '../../../monitor-binding/number/plugin';
import {StringMonitorParams} from '../../../monitor-binding/string/plugin';

export type InputParams =
	| BooleanInputParams
	| ColorInputParams
	| NumberInputParams
	| Point2dInputParams
	| Point3dInputParams
	| Point4dInputParams
	| StringInputParams;

export type MonitorParams =
	| BooleanMonitorParams
	| NumberMonitorParams
	| StringMonitorParams;

export interface ButtonParams extends BaseParams {
	title: string;

	label?: string;
}

export interface FolderParams extends BaseParams {
	title: string;

	expanded?: boolean;
}

export type SeparatorParams = BaseParams;

export interface TabParams extends BaseParams {
	pages: {
		title: string;
	}[];
}
