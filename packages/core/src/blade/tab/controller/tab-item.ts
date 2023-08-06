import {Controller} from '../../../common/controller/controller.js';
import {Emitter} from '../../../common/model/emitter.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {TabItemProps, TabItemView} from '../view/tab-item.js';

/**
 * @hidden
 */
export interface TabItemEvents {
	click: {
		sender: TabItemController;
	};
}

/**
 * @hidden
 */
interface Config {
	props: TabItemProps;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class TabItemController implements Controller<TabItemView> {
	public readonly emitter: Emitter<TabItemEvents> = new Emitter();
	public readonly props: TabItemProps;
	public readonly view: TabItemView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.onClick_ = this.onClick_.bind(this);

		this.props = config.props;
		this.viewProps = config.viewProps;

		this.view = new TabItemView(doc, {
			props: config.props,
			viewProps: config.viewProps,
		});
		this.view.buttonElement.addEventListener('click', this.onClick_);
	}

	private onClick_(): void {
		this.emitter.emit('click', {
			sender: this,
		});
	}
}
