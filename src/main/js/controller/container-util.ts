import {UiControllerList} from '../model/ui-controller-list';
import {ViewPosition} from '../model/view-positions';

export function updateAllItemsPositions(
	uiControllerList: UiControllerList,
): void {
	const visibleItems = uiControllerList.items.filter(
		(uc) => !uc.viewModel.hidden,
	);
	const firstVisibleItem = visibleItems[0];
	const lastVisibleItem = visibleItems[visibleItems.length - 1];

	uiControllerList.items.forEach((uc) => {
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
