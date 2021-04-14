import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {bindValueMap} from '../../../common/view/reactive';
import {Blade} from '../../common/model/blade';
import {RackController} from '../../rack/controller/rack';
import {TabItemProps} from '../view/tab-item';
import {TabItemController} from './tab-item';

export type TabPageProps = ValueMap<{
	selected: boolean;
}>;

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
			viewProps: createViewProps(),
		});
		this.ic_.emitter.on('click', this.onItemClick_);

		this.cc_ = new RackController(doc, {
			blade: new Blade(),
			viewProps: createViewProps(),
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
