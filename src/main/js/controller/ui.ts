import Target from '../model/target';
import * as InputBindingControllerCreators from './binding-creators/input';
import * as MonitorBindingControllerCreators from './binding-creators/monitor';
import ButtonController from './button';
import FolderController from './folder';
import SeparatorController from './separator';

export interface InputParams {
	label?: string;
	max?: number;
	min?: number;
	options?: {text: string; value: unknown}[] | {[key: string]: unknown};
	presetKey?: string;
	step?: number;
}

export interface MonitorParams {
	count?: number;
	interval?: number;
	label?: string;
	max?: number;
	min?: number;
	multiline?: boolean;
	type?: string;
}

export interface ButtonParams {
	title: string;
}

export interface FolderParams {
	expanded?: boolean;
	title: string;
}

interface InputConfig {
	params: InputParams;
	target: Target;
	type: 'input';
}

interface MonitorConfig {
	params: MonitorParams;
	target: Target;
	type: 'monitor';
}

interface ButtonConfig {
	params: ButtonParams;
	type: 'button';
}

interface FolderConfig {
	params: FolderParams;
	type: 'folder';
}

export type UiConfig =
	| ButtonConfig
	| FolderConfig
	| InputConfig
	| MonitorConfig;

export type UiController =
	| ButtonController
	| FolderController
	| SeparatorController
	| ReturnType<typeof InputBindingControllerCreators.create>
	| ReturnType<typeof MonitorBindingControllerCreators.create>;
