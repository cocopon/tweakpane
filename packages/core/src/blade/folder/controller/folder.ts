import {ViewProps} from '../../../common/model/view-props.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state.js';
import {ContainerBladeController} from '../../common/controller/container-blade.js';
import {RackController} from '../../common/controller/rack.js';
import {Blade} from '../../common/model/blade.js';
import {bindFoldable, Foldable} from '../../common/model/foldable.js';
import {FolderProps, FolderView} from '../view/folder.js';

/**
 * @hidden
 */
interface Config {
	expanded?: boolean;
	blade: Blade;
	props: FolderProps;
	viewProps: ViewProps;

	root?: boolean;
}

/**
 * @hidden
 */
export class FolderController extends ContainerBladeController<FolderView> {
	public readonly foldable: Foldable;
	public readonly props: FolderProps;

	/**
	 * @hidden
	 */
	constructor(doc: Document, config: Config) {
		const foldable = Foldable.create(config.expanded ?? true);
		const view = new FolderView(doc, {
			foldable: foldable,
			props: config.props,
			viewName: config.root ? 'rot' : undefined,
			viewProps: config.viewProps,
		});
		super({
			...config,
			rackController: new RackController({
				blade: config.blade,
				element: view.containerElement,
				root: config.root,
				viewProps: config.viewProps,
			}),
			view: view,
		});

		this.onTitleClick_ = this.onTitleClick_.bind(this);

		this.props = config.props;

		this.foldable = foldable;
		bindFoldable(this.foldable, this.view.containerElement);

		// Clean up transition manually
		// Toggling `expanded` doesn't fire transition events in some cases
		// (e.g. expanding empty folder: 0px -> 0px)
		this.rackController.rack.emitter.on('add', () => {
			this.foldable.cleanUpTransition();
		});
		this.rackController.rack.emitter.on('remove', () => {
			this.foldable.cleanUpTransition();
		});

		this.view.buttonElement.addEventListener('click', this.onTitleClick_);
	}

	get document(): Document {
		return this.view.element.ownerDocument;
	}

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
			(p) => ({
				expanded: p.required.boolean,
				title: p.optional.string,
			}),
			(result) => {
				this.foldable.set('expanded', result.expanded);
				this.props.set('title', result.title);
				return true;
			},
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			expanded: this.foldable.get('expanded'),
			title: this.props.get('title'),
		});
	}

	private onTitleClick_() {
		this.foldable.set('expanded', !this.foldable.get('expanded'));
	}
}
