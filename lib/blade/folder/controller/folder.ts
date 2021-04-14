import {
	disableTransitionTemporarily,
	forceReflow,
} from '../../../common/dom-util';
import {ViewProps} from '../../../common/model/view-props';
import {isEmpty} from '../../../misc/type-util';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {RackController} from '../../rack/controller/rack';
import {Folder, FolderEvents} from '../model/folder';
import {FolderProps, FolderView} from '../view/folder';

interface Config {
	expanded?: boolean;
	blade: Blade;
	props: FolderProps;
	viewProps: ViewProps;

	root?: boolean;
}

function computeExpandedFolderHeight(
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

/**
 * @hidden
 */
export class FolderController extends BladeController<FolderView> {
	public readonly folder: Folder;
	public readonly props: FolderProps;
	private readonly rc_: RackController;

	constructor(doc: Document, config: Config) {
		const folder = new Folder(config.expanded ?? true);
		const rc = new RackController(doc, {
			blade: config.blade,
			root: config.root,
			viewProps: config.viewProps,
		});
		super({
			...config,
			view: new FolderView(doc, {
				containerElement: rc.view.element,
				folder: folder,
				props: config.props,
				viewName: config.root ? 'rot' : undefined,
				viewProps: config.viewProps,
			}),
		});

		this.onContainerTransitionEnd_ = this.onContainerTransitionEnd_.bind(this);
		this.onFolderBeforeChange_ = this.onFolderBeforeChange_.bind(this);
		this.onTitleClick_ = this.onTitleClick_.bind(this);

		this.props = config.props;

		this.folder = folder;
		this.folder.emitter.on('beforechange', this.onFolderBeforeChange_);

		this.rc_ = rc;

		this.view.buttonElement.addEventListener('click', this.onTitleClick_);
		this.view.containerElement.addEventListener(
			'transitionend',
			this.onContainerTransitionEnd_,
		);
	}

	get document(): Document {
		return this.view.element.ownerDocument;
	}

	get rackController(): RackController {
		return this.rc_;
	}

	public onDispose() {
		this.rc_.onDispose();
	}

	private onFolderBeforeChange_(ev: FolderEvents['beforechange']): void {
		if (ev.propertyName !== 'expanded') {
			return;
		}

		if (isEmpty(this.folder.expandedHeight)) {
			this.folder.expandedHeight = computeExpandedFolderHeight(
				this.folder,
				this.view.containerElement,
			);
		}

		this.folder.shouldFixHeight = true;
		forceReflow(this.view.containerElement);
	}

	private onTitleClick_() {
		this.folder.expanded = !this.folder.expanded;
	}

	private onContainerTransitionEnd_(ev: TransitionEvent): void {
		if (ev.propertyName !== 'height') {
			return;
		}

		this.folder.shouldFixHeight = false;
		this.folder.expandedHeight = null;
	}
}
