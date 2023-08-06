import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../blade/common/controller/blade-state.js';
import {forceCast} from '../../misc/type-util.js';
import {normalizeListOptions, parseListOptions} from '../list-util.js';
import {Value} from '../model/value.js';
import {ViewProps} from '../model/view-props.js';
import {ListParamsOptions} from '../params.js';
import {ListProps, ListView} from '../view/list.js';
import {ValueController} from './value.js';

/**
 * @hidden
 */
interface Config<T> {
	props: ListProps<T>;
	value: Value<T>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ListController<T>
	implements ValueController<T, ListView<T>>, PropsPortable
{
	public readonly value: Value<T>;
	public readonly view: ListView<T>;
	public readonly props: ListProps<T>;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config<T>) {
		this.onSelectChange_ = this.onSelectChange_.bind(this);

		this.props = config.props;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new ListView(doc, {
			props: this.props,
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.selectElement.addEventListener('change', this.onSelectChange_);
	}

	private onSelectChange_(e: Event): void {
		const selectElem: HTMLSelectElement = forceCast(e.currentTarget);
		this.value.rawValue =
			this.props.get('options')[selectElem.selectedIndex].value;
	}

	public importProps(state: BladeState): boolean {
		return importBladeState(
			state,
			null,
			(p) => ({
				options: p.required.custom<ListParamsOptions<T>>(parseListOptions),
			}),
			(result) => {
				this.props.set('options', normalizeListOptions(result.options));
				return true;
			},
		);
	}

	public exportProps(): BladeState {
		return exportBladeState(null, {
			options: this.props.get('options'),
		});
	}
}
