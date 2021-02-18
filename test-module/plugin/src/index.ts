import Tweakpane from 'tweakpane';
// Import individual classes
import {ValueController} from 'tweakpane/src/main/ts/controller/value/value';
import {Value} from 'tweakpane/src/main/ts/model/value';
import {ViewModel} from 'tweakpane/src/main/ts/model/view-model';
import {ValueView} from 'tweakpane/src/main/ts/view/value/value';
import {View} from 'tweakpane/src/main/ts/view/view';

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
		this.valueElem_ = doc.createElement('button');
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
			model: {
				accept: (value, params) => {
					if (params.view !== 'test') {
						return null;
					}
					return typeof value === 'string' ? value : null;
				},
				reader: () => (v) => v,
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
