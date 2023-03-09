import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../blade/common/controller/blade-state';
import {forceCast} from '../../misc/type-util';
import {Value} from '../model/value';
import {ViewProps} from '../model/view-props';
import {ListParamsOptions} from '../params';
import {normalizeListOptions, parseListOptions} from '../util';
import {ListProps, ListView} from '../view/list';
import {ValueController} from './value';

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
		const optElem = selectElem.selectedOptions.item(0);
		if (!optElem) {
			return;
		}

		const itemIndex = Number(optElem.dataset.index);
		this.value.rawValue = this.props.get('options')[itemIndex].value;
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