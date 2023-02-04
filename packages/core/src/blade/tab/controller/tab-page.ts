import {bindValueMap} from '../../../common/model/reactive';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {PlainView} from '../../../common/view/plain';
import {RackLikeController} from '../../common/controller/rack-like';
import {Blade} from '../../common/model/blade';
import {RackController} from '../../rack/controller/rack';
import {TabItemProps} from '../view/tab-item';
import {TabItemController} from './tab-item';

export type TabPagePropsObject = {
	selected: boolean;
};

export type TabPageProps = ValueMap<TabPagePropsObject>;

interface Config {
	blade: Blade;
	itemProps: TabItemProps;
	props: TabPageProps;
	viewProps: ViewProps;
}

export class TabPageController extends RackLikeController<PlainView> {
	public readonly props: TabPageProps;
	private readonly ic_: TabItemController;

	constructor(doc: Document, config: Config) {
		const cc = new RackController(doc, {
			blade: config.blade,
			viewProps: config.viewProps,
		});
		super({
			...config,
			rackController: cc,
			view: cc.view,
		});

		this.onItemClick_ = this.onItemClick_.bind(this);

		this.ic_ = new TabItemController(doc, {
			props: config.itemProps,
			viewProps: ViewProps.create(),
		});
		this.ic_.emitter.on('click', this.onItemClick_);

		this.props = config.props;
		bindValueMap(this.props, 'selected', (selected) => {
			this.itemController.props.set('selected', selected);
			this.viewProps.set('hidden', !selected);
		});
	}

	get itemController(): TabItemController {
		return this.ic_;
	}

	private onItemClick_(): void {
		this.props.set('selected', true);
	}
}
