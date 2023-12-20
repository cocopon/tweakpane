import {Controller} from '../../../common/controller/controller.js';
import {Emitter} from '../../../common/model/emitter.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../common/controller/blade-state.js';
import {ButtonProps, ButtonView} from '../view/button.js';

/**
 * @hidden
 */
export interface ButtonEvents {
	click: {
		nativeEvent: MouseEvent;
		sender: ButtonController;
	};
}

/**
 * @hidden
 */
interface Config {
	props: ButtonProps;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ButtonController implements Controller<ButtonView>, PropsPortable {
	public readonly emitter: Emitter<ButtonEvents> = new Emitter();
	public readonly props: ButtonProps;
	public readonly view: ButtonView;
	public readonly viewProps: ViewProps;

	/**
	 * @hidden
	 */
	constructor(doc: Document, config: Config) {
		this.onClick_ = this.onClick_.bind(this);

		this.props = config.props;
		this.viewProps = config.viewProps;

		this.view = new ButtonView(doc, {
			props: this.props,
			viewProps: this.viewProps,
		});
		this.view.buttonElement.addEventListener('click', this.onClick_);
	}

	public importProps(state: BladeState): boolean {
		return importBladeState(
			state,
			null,
			(p) => ({
				title: p.optional.string,
			}),
			(result) => {
				this.props.set('title', result.title);
				return true;
			},
		);
	}

	public exportProps(): BladeState {
		return exportBladeState(null, {
			title: this.props.get('title'),
		});
	}

	private onClick_(ev: MouseEvent): void {
		this.emitter.emit('click', {
			nativeEvent: ev,
			sender: this,
		});
	}
}
