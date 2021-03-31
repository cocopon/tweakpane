import {BladeController} from '../controller/blade';

/**
 * @hidden
 */
export interface BladeApi {
	readonly controller_: BladeController;
	hidden: boolean;
	dispose(): void;
}
