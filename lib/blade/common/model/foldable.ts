import {
	disableTransitionTemporarily,
	forceReflow,
} from '../../../common/dom-util';
import {ValueMap} from '../../../common/model/value-map';
import {isEmpty} from '../../../misc/type-util';

type FoldableObject = {
	expanded: boolean;
	expandedHeight: number | null;
	shouldFixHeight: boolean;
	// For computing expanded height
	temporaryExpanded: boolean | null;
};

/**
 * @hidden
 */
export type Foldable = ValueMap<FoldableObject>;

export function createFoldable(expanded: boolean): Foldable {
	return ValueMap.fromObject<FoldableObject>({
		expanded: expanded,
		expandedHeight: null,
		shouldFixHeight: false,
		temporaryExpanded: null,
	});
}

function computeExpandedFolderHeight(
	folder: Foldable,
	containerElement: HTMLElement,
): number {
	let height = 0;

	disableTransitionTemporarily(containerElement, () => {
		// Expand folder temporarily
		folder.set('expandedHeight', null);
		folder.set('temporaryExpanded', true);

		forceReflow(containerElement);

		// Compute height
		height = containerElement.clientHeight;

		// Restore expanded
		folder.set('temporaryExpanded', null);

		forceReflow(containerElement);
	});

	return height;
}

export function getFoldableStyleExpanded(foldable: Foldable): boolean {
	return foldable.get('temporaryExpanded') ?? foldable.get('expanded');
}

export function getFoldableStyleHeight(foldable: Foldable): string {
	if (!getFoldableStyleExpanded(foldable)) {
		return '0';
	}

	const exHeight = foldable.get('expandedHeight');
	if (foldable.get('shouldFixHeight') && !isEmpty(exHeight)) {
		return `${exHeight}px`;
	}

	return 'auto';
}

function applyHeight(foldable: Foldable, elem: HTMLElement): void {
	elem.style.height = getFoldableStyleHeight(foldable);
}

export function bindFoldable(foldable: Foldable, elem: HTMLElement): void {
	foldable.value('expanded').emitter.on('beforechange', () => {
		if (isEmpty(foldable.get('expandedHeight'))) {
			foldable.set(
				'expandedHeight',
				computeExpandedFolderHeight(foldable, elem),
			);
		}

		foldable.set('shouldFixHeight', true);
		forceReflow(elem);
	});

	foldable.emitter.on('change', () => {
		applyHeight(foldable, elem);
	});
	applyHeight(foldable, elem);

	elem.addEventListener('transitionend', (ev) => {
		if (ev.propertyName !== 'height') {
			return;
		}

		foldable.set('shouldFixHeight', false);
		foldable.set('expandedHeight', null);
	});
}
