import {BladeController} from '../plugin/blade/common/controller/blade';

/**
 * @hidden
 */
export interface BladeApi {
	readonly controller_: BladeController;
	hidden: boolean;
	dispose(): void;
}
