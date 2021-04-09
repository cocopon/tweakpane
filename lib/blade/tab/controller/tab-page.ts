import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {bindValueMap} from '../../../common/view/reactive';
import {BladeRackController} from '../../blade-rack/controller/blade-rack';
import {Blade} from '../../common/model/blade';
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
	private readonly cc_: BladeRackController;

	constructor(doc: Document, config: Config) {
		this.ic_ = new TabItemController(doc, {
			props: config.itemProps,
			viewProps: createViewProps(),
		});
		this.cc_ = new BladeRackController(doc, {
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

	get contentController(): BladeRackController {
		return this.cc_;
	}
}
