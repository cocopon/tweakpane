import {ViewProps} from '../../../common/model/view-props';
import {RackLikeController} from '../../common/controller/rack-like';
import {Blade} from '../../common/model/blade';
import {bindFoldable, Foldable} from '../../common/model/foldable';
import {RackController} from '../../rack/controller/rack';
import {FolderProps, FolderView} from '../view/folder';

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
export class FolderController extends RackLikeController<FolderView> {
	public readonly foldable: Foldable;
	public readonly props: FolderProps;

	constructor(doc: Document, config: Config) {
		const foldable = Foldable.create(config.expanded ?? true);
		const rc = new RackController(doc, {
			blade: config.blade,
			root: config.root,
			viewProps: config.viewProps,
		});
		super({
			...config,
			rackController: rc,
			view: new FolderView(doc, {
				containerElement: rc.view.element,
				foldable: foldable,
				props: config.props,
				viewName: config.root ? 'rot' : undefined,
				viewProps: config.viewProps,
			}),
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

	private onTitleClick_() {
		this.foldable.set('expanded', !this.foldable.get('expanded'));
	}
}
