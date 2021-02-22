import {disableTransitionTemporarily, forceReflow} from '../dom-util';
import {BladePosition} from '../model/blade-positions';
import {Folder} from '../model/folder';
import {UiContainer} from '../model/ui-container';

export function updateAllItemsPositions(uiContainer: UiContainer): void {
	const visibleItems = uiContainer.items.filter((uc) => !uc.blade.hidden);
	const firstVisibleItem = visibleItems[0];
	const lastVisibleItem = visibleItems[visibleItems.length - 1];

	uiContainer.items.forEach((uc) => {
		const ps: BladePosition[] = [];
		if (uc === firstVisibleItem) {
			ps.push('first');
		}
		if (uc === lastVisibleItem) {
			ps.push('last');
		}
		uc.blade.positions = ps;
	});
}

/**
 * @hidden
 */
export function computeExpandedFolderHeight(
	folder: Folder,
	containerElement: HTMLElement,
): number {
	let height = 0;

	disableTransitionTemporarily(containerElement, () => {
		// Expand folder temporarily
		folder.expandedHeight = null;
		folder.temporaryExpanded = true;

		forceReflow(containerElement);

		// Compute height
		height = containerElement.clientHeight;

		// Restore expanded
		folder.temporaryExpanded = null;

		forceReflow(containerElement);
	});

	return height;
}
