import {
	disableTransitionTemporarily,
	forceReflow,
} from '../../../common/dom-util';
import {bindValueMap} from '../../../common/model/reactive';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {isEmpty} from '../../../misc/type-util';

type FoldableObject = {
	completed: boolean;
	expanded: boolean;
	expandedHeight: number | null;
	shouldFixHeight: boolean;
	// For computing expanded height
	temporaryExpanded: boolean | null;
};

/**
 * @hidden
 */
export class Foldable extends ValueMap<FoldableObject> {
	constructor(valueMap: {
		[Key in keyof FoldableObject]: Value<FoldableObject[Key]>;
	}) {
		super(valueMap);
	}

	public static create(expanded: boolean): Foldable {
		const coreObj: FoldableObject = {
			completed: true,
			expanded: expanded,
			expandedHeight: null,
			shouldFixHeight: false,
			temporaryExpanded: null,
		};
		const core = ValueMap.createCore(coreObj);
		return new Foldable(core);
	}

	get styleExpanded(): boolean {
		return this.get('temporaryExpanded') ?? this.get('expanded');
	}

	get styleHeight(): string {
		if (!this.styleExpanded) {
			return '0';
		}

		const exHeight = this.get('expandedHeight');
		if (this.get('shouldFixHeight') && !isEmpty(exHeight)) {
			return `${exHeight}px`;
		}

		return 'auto';
	}

	public bindExpandedClass(elem: HTMLElement, expandedClassName: string): void {
		const onExpand = () => {
			const expanded = this.styleExpanded;
			if (expanded) {
				elem.classList.add(expandedClassName);
			} else {
				elem.classList.remove(expandedClassName);
			}
		};

		bindValueMap(this, 'expanded', onExpand);
		bindValueMap(this, 'temporaryExpanded', onExpand);
	}

	public cleanUpTransition(): void {
		this.set('shouldFixHeight', false);
		this.set('expandedHeight', null);
		this.set('completed', true);
	}
}

/**
 * @deprecated Use Foldable.create instead.
 */
export function createFoldable(expanded: boolean): Foldable {
	// TODO: Warn deprecation at next minor version
	return Foldable.create(expanded);
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

/**
 * @deprecated Use foldable.styleExpanded instead.
 */
export function getFoldableStyleExpanded(foldable: Foldable): boolean {
	return foldable.styleExpanded;
}

/**
 * @deprecated Use foldable.styleHeight instead.
 */
export function getFoldableStyleHeight(foldable: Foldable): string {
	return foldable.styleHeight;
}

function applyHeight(foldable: Foldable, elem: HTMLElement): void {
	elem.style.height = foldable.styleHeight;
}

export function bindFoldable(foldable: Foldable, elem: HTMLElement): void {
	foldable.value('expanded').emitter.on('beforechange', () => {
		foldable.set('completed', false);

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

		foldable.cleanUpTransition();
	});
}
