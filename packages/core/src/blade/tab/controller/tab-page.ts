import {bindValueMap} from '../../../common/model/reactive';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createBlade} from '../../common/model/blade';
import {RackController} from '../../rack/controller/rack';
import {TabItemProps} from '../view/tab-item';
import {TabItemController} from './tab-item';

export type TabPagePropsObject = {
	selected: boolean;
};

export type TabPageProps = ValueMap<TabPagePropsObject>;

interface Config {
	itemProps: TabItemProps;
	props: TabPageProps;
}

export class TabPageController {
	public readonly props: TabPageProps;
	private readonly ic_: TabItemController;
	private readonly cc_: RackController;

	constructor(doc: Document, config: Config) {
		this.onItemClick_ = this.onItemClick_.bind(this);

		this.ic_ = new TabItemController(doc, {
			props: config.itemProps,
			viewProps: ViewProps.create(),
		});
		this.ic_.emitter.on('click', this.onItemClick_);

		this.cc_ = new RackController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});

		this.props = config.props;
		bindValueMap(this.props, 'selected', (selected) => {
			this.itemController.props.set('selected', selected);
			this.contentController.viewProps.set('hidden', !selected);
		});
	}

	get itemController(): TabItemController {
		return this.ic_;
	}

	get contentController(): RackController {
		return this.cc_;
	}

	private onItemClick_(): void {
		this.props.set('selected', true);
	}
}
