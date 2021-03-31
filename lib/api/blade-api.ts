import {BladeController} from '../plugin/blade/common/controller/blade';

/**
 * @hidden
 */
export interface BladeApi {
	readonly controller: BladeController;
	hidden: boolean;
	dispose(): void;
}
