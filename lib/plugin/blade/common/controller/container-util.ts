import {
	disableTransitionTemporarily,
	forceReflow,
} from '../../../common/dom-util';
import {Folder} from '../../../common/model/folder';
import {BladePosition} from '../model/blade-positions';
import {BladeRack} from '../model/blade-rack';

export function updateAllItemsPositions(bladeRack: BladeRack): void {
	const visibleItems = bladeRack.items.filter((bc) => !bc.blade.hidden);
	const firstVisibleItem = visibleItems[0];
	const lastVisibleItem = visibleItems[visibleItems.length - 1];

	bladeRack.items.forEach((bc) => {
		const ps: BladePosition[] = [];
		if (bc === firstVisibleItem) {
			ps.push('first');
		}
		if (bc === lastVisibleItem) {
			ps.push('last');
		}
		bc.blade.positions = ps;
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
