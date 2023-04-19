import {ValueController} from '../../../common/controller/value.js';
import {Emitter} from '../../../common/model/emitter.js';
import {
	Value,
	ValueChangeOptions,
	ValueEvents,
} from '../../../common/model/value.js';
import {ViewProps, ViewPropsEvents} from '../../../common/model/view-props.js';
import {TpError} from '../../../common/tp-error.js';
import {BladeController} from '../controller/blade.js';
import {isContainerBladeController} from '../controller/container-blade.js';
import {isValueBladeController} from '../controller/value-blade.js';
import {Blade} from './blade.js';
import {BladePosition} from './blade-positions.js';
import {
	NestedOrderedSet,
	NestedOrderedSetEvents,
} from './nested-ordered-set.js';

/**
 * @hidden
 */
export interface RackEvents {
	add: {
		bladeController: BladeController;
		index: number;
		root: boolean;
		sender: Rack;
	};
	remove: {
		bladeController: BladeController;
		root: boolean;
		sender: Rack;
	};

	valuechange: {
		bladeController: BladeController & ValueController<unknown>;
		options: ValueChangeOptions;
		sender: Rack;
	};
	layout: {
		sender: Rack;
	};
}

function findValueBladeController(
	bcs: BladeController[],
	v: Value<unknown>,
): (BladeController & ValueController<unknown>) | null {
	for (let i = 0; i < bcs.length; i++) {
		const bc = bcs[i];
		if (isValueBladeController(bc) && bc.value === v) {
			return bc;
		}
	}
	return null;
}

function findSubBladeControllerSet(
	bc: BladeController,
): NestedOrderedSet<BladeController> | null {
	return isContainerBladeController(bc)
		? bc.rackController.rack['bcSet_']
		: null;
}

/**
 * @hidden
 */
interface Config {
	blade?: Blade;
	viewProps: ViewProps;
}

/**
 * A collection of blade controllers that manages positions and event propagation.
 * @hidden
 */
export class Rack {
	public readonly emitter: Emitter<RackEvents> = new Emitter();
	public readonly viewProps: ViewProps;
	private readonly blade_: Blade | null;
	private readonly bcSet_: NestedOrderedSet<BladeController>;

	constructor(config: Config) {
		this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this);
		this.onSetAdd_ = this.onSetAdd_.bind(this);
		this.onSetRemove_ = this.onSetRemove_.bind(this);
		this.onChildDispose_ = this.onChildDispose_.bind(this);
		this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this);
		this.onChildValueChange_ = this.onChildValueChange_.bind(this);
		this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);
		this.onRackLayout_ = this.onRackLayout_.bind(this);
		this.onRackValueChange_ = this.onRackValueChange_.bind(this);

		this.blade_ = config.blade ?? null;
		this.blade_
			?.value('positions')
			.emitter.on('change', this.onBladePositionsChange_);
		this.viewProps = config.viewProps;

		this.bcSet_ = new NestedOrderedSet(findSubBladeControllerSet);
		this.bcSet_.emitter.on('add', this.onSetAdd_);
		this.bcSet_.emitter.on('remove', this.onSetRemove_);
	}

	get children(): BladeController[] {
		return this.bcSet_.items;
	}

	public add(bc: BladeController, opt_index?: number): void {
		bc.parent?.remove(bc);
		bc.parent = this;

		this.bcSet_.add(bc, opt_index);
	}

	public remove(bc: BladeController): void {
		bc.parent = null;

		this.bcSet_.remove(bc);
	}

	public find<B extends BladeController>(
		finder: (bc: BladeController) => bc is B,
	): B[] {
		return this.bcSet_.allItems().filter(finder);
	}

	private onSetAdd_(ev: NestedOrderedSetEvents<BladeController>['add']) {
		this.updatePositions_();

		const root = ev.target === ev.root;
		this.emitter.emit('add', {
			bladeController: ev.item,
			index: ev.index,
			root: root,
			sender: this,
		});

		if (!root) {
			return;
		}

		const bc = ev.item;
		bc.viewProps.emitter.on('change', this.onChildViewPropsChange_);
		bc.blade
			.value('positions')
			.emitter.on('change', this.onChildPositionsChange_);
		bc.viewProps.handleDispose(this.onChildDispose_);

		if (isValueBladeController(bc)) {
			bc.value.emitter.on('change', this.onChildValueChange_);
		} else if (isContainerBladeController(bc)) {
			const rack = bc.rackController.rack;
			if (rack) {
				const emitter = rack.emitter;
				emitter.on('layout', this.onRackLayout_);
				emitter.on('valuechange', this.onRackValueChange_);
			}
		}
	}

	private onSetRemove_(ev: NestedOrderedSetEvents<BladeController>['remove']) {
		this.updatePositions_();

		const root = ev.target === ev.root;
		this.emitter.emit('remove', {
			bladeController: ev.item,
			root: root,
			sender: this,
		});

		if (!root) {
			return;
		}

		const bc = ev.item;
		if (isValueBladeController(bc)) {
			bc.value.emitter.off('change', this.onChildValueChange_);
		} else if (isContainerBladeController(bc)) {
			const rack = bc.rackController.rack;
			if (rack) {
				const emitter = rack.emitter;
				emitter.off('layout', this.onRackLayout_);
				emitter.off('valuechange', this.onRackValueChange_);
			}
		}
	}

	private updatePositions_(): void {
		const visibleItems = this.bcSet_.items.filter(
			(bc) => !bc.viewProps.get('hidden'),
		);
		const firstVisibleItem = visibleItems[0];
		const lastVisibleItem = visibleItems[visibleItems.length - 1];

		this.bcSet_.items.forEach((bc) => {
			const ps: BladePosition[] = [];
			if (bc === firstVisibleItem) {
				ps.push('first');

				if (
					!this.blade_ ||
					this.blade_.get('positions').includes('veryfirst')
				) {
					ps.push('veryfirst');
				}
			}
			if (bc === lastVisibleItem) {
				ps.push('last');

				if (!this.blade_ || this.blade_.get('positions').includes('verylast')) {
					ps.push('verylast');
				}
			}
			bc.blade.set('positions', ps);
		});
	}

	private onChildPositionsChange_() {
		this.updatePositions_();
		this.emitter.emit('layout', {
			sender: this,
		});
	}

	private onChildViewPropsChange_(_ev: ViewPropsEvents['change']) {
		this.updatePositions_();
		this.emitter.emit('layout', {
			sender: this,
		});
	}

	private onChildDispose_(): void {
		const disposedUcs = this.bcSet_.items.filter((bc) => {
			return bc.viewProps.get('disposed');
		});
		disposedUcs.forEach((bc) => {
			this.bcSet_.remove(bc);
		});
	}

	private onChildValueChange_(ev: ValueEvents<unknown>['change']) {
		const bc = findValueBladeController(
			this.find(isValueBladeController),
			ev.sender,
		);
		if (!bc) {
			throw TpError.alreadyDisposed();
		}
		this.emitter.emit('valuechange', {
			bladeController: bc,
			options: ev.options,
			sender: this,
		});
	}

	private onRackLayout_(_: RackEvents['layout']) {
		this.updatePositions_();
		this.emitter.emit('layout', {
			sender: this,
		});
	}

	private onRackValueChange_(ev: RackEvents['valuechange']) {
		this.emitter.emit('valuechange', {
			bladeController: ev.bladeController,
			options: ev.options,
			sender: this,
		});
	}

	private onBladePositionsChange_(): void {
		this.updatePositions_();
	}
}
