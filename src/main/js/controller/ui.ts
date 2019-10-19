import * as InputBindingControllerCreators from './binding-creators/input';
import * as MonitorBindingControllerCreators from './binding-creators/monitor';
import ButtonController from './button';
import FolderController from './folder';
import SeparatorController from './separator';

/**
 * @hidden
 */
export type UiController =
	| ButtonController
	| FolderController
	| SeparatorController
	| ReturnType<typeof InputBindingControllerCreators.create>
	| ReturnType<typeof MonitorBindingControllerCreators.create>;
