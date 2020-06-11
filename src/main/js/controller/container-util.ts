import {UiContainer} from '../model/ui-container';
import {ViewPosition} from '../model/view-positions';

export function updateAllItemsPositions(uiContainer: UiContainer): void {
	const visibleItems = uiContainer.items.filter((uc) => !uc.viewModel.hidden);
	const firstVisibleItem = visibleItems[0];
	const lastVisibleItem = visibleItems[visibleItems.length - 1];

	uiContainer.items.forEach((uc) => {
		const ps: ViewPosition[] = [];
		if (uc === firstVisibleItem) {
			ps.push('first');
		}
		if (uc === lastVisibleItem) {
			ps.push('last');
		}
		uc.viewModel.positions = ps;
	});
}
