import {Controller} from '../../../common/controller/controller';
import {Emitter} from '../../../common/model/emitter';
import {ViewProps} from '../../../common/model/view-props';
import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../common/controller/blade-state';
import {ButtonProps, ButtonView} from '../view/button';

/**
 * @hidden
 */
export interface ButtonEvents {
	click: {
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

	private onClick_(): void {
		this.emitter.emit('click', {
			sender: this,
		});
	}
}
