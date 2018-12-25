import FolderController from './folder';

import {Class} from '../misc/type-util';
import {UiController} from './ui';

export function findControllers<Controller>(
	uiControllers: UiController[],
	controllerClass: Class<Controller>,
): Controller[] {
	return uiControllers.reduce(
		(results, uc) => {
			if (uc instanceof FolderController) {
				// eslint-disable-next-line no-use-before-define
				results.push(
					...findControllers(uc.uiControllerList.items, controllerClass),
				);
			}

			if (uc instanceof controllerClass) {
				results.push(uc);
			}

			return results;
		},
		[] as Controller[],
	);
}
