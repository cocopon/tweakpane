import {Controller} from '../../../common/controller/controller';
import {Emitter} from '../../../common/model/emitter';
import {ViewProps} from '../../../common/model/view-props';
import {ButtonProps, ButtonView} from '../view/button';

/**
 * @hidden
 */
export interface ButtonEvents {
	click: {
		sender: ButtonController;
	};
}

interface Config {
	props: ButtonProps;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ButtonController implements Controller<ButtonView> {
	public readonly emitter: Emitter<ButtonEvents> = new Emitter();
	public readonly props: ButtonProps;
	public readonly view: ButtonView;
	public readonly viewProps: ViewProps;

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

	private onClick_(): void {
		this.emitter.emit('click', {
			sender: this,
		});
	}
}
