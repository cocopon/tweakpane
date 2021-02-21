import Tweakpane from 'tweakpane';
// Import individual classes
import {ValueController} from 'tweakpane/lib/plugin/common/controller/value';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {ViewModel} from 'tweakpane/lib/plugin/common/model/view-model';
import {ClassName} from 'tweakpane/lib/plugin/common/view/class-name';
import {ValueView} from 'tweakpane/lib/plugin/common/view/value';
import {View} from 'tweakpane/lib/plugin/common/view/view';

interface ViewConfig {
	model: ViewModel;
	value: Value<string>;
}

class TestView extends View implements ValueView<string> {
	public readonly value: Value<string>;
	private valueElem_: HTMLElement;

	constructor(doc: Document, config: ViewConfig) {
		super(doc, config);

		this.value = config.value;

		const className = ClassName('tst');
		this.valueElem_ = doc.createElement('button');
		this.valueElem_.classList.add(className('v'));
		this.element.appendChild(this.valueElem_);

		this.update();
	}

	public update(): void {
		this.valueElem_.textContent = this.value.rawValue;
	}
}

class TestController implements ValueController<string> {
	public readonly value: Value<string>;
	public readonly view: TestView;
	public readonly viewModel: ViewModel;

	constructor(doc: Document, config: {value: Value<string>}) {
		this.value = config.value;
		this.viewModel = new ViewModel();

		this.view = new TestView(doc, {
			model: this.viewModel,
			value: config.value,
		});
	}
}

{
	Tweakpane.registerPlugin<string, string>({
		type: 'input',
		plugin: {
			id: 'input-test',
			// Embed CSS by @rollup/plugin-replace
			css: '__css__',

			model: {
				accept: (value, params) => {
					if (params.view !== 'test') {
						return null;
					}
					return typeof value === 'string' ? value : null;
				},
				reader: () => (v) => String(v),
				writer: () => (v) => v,
			},

			controller: (args): ValueController<string> => {
				return new TestController(args.document, {
					value: args.binding.value,
				});
			},
		},
	});
}
