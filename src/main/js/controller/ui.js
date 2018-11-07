// @flow

import Target from '../model/target';
import * as InputBindingControllerCreators from './binding-creators/input';
import * as MonitorBindingControllerCreators from './binding-creators/monitor';
import ButtonController from './button';
import FolderController from './folder';
import SeparatorController from './separator';

export type InputParams = {
	label?: string,
	max?: number,
	min?: number,
	options?: {text: string, value: mixed}[] | {[string]: mixed},
	presetKey?: string,
	step?: number,
};

export type MonitorParams = {
	count?: number,
	interval?: number,
	label?: string,
	max?: number,
	min?: number,
	multiline?: boolean,
	type?: string,
};

export type ButtonParams = {
	title: string,
};

export type FolderParams = {
	expanded?: boolean,
	title: string,
};

type InputConfig = {
	params: InputParams,
	target: Target,
	type: 'input',
};

type MonitorConfig = {
	params: MonitorParams,
	target: Target,
	type: 'monitor',
};

type ButtonConfig = {
	params: ButtonParams,
	type: 'button',
};

type FolderConfig = {
	params: FolderParams,
	type: 'folder',
};

export type UiConfig = ButtonConfig |
	FolderConfig |
	InputConfig |
	MonitorConfig;

export type UiController = ButtonController |
	FolderController |
	SeparatorController |
	$Call<typeof InputBindingControllerCreators.create, Document, Target, InputParams> |
	$Call<typeof MonitorBindingControllerCreators.create, Document, Target, MonitorParams>;
