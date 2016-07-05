import ClassName from '../misc/class_name';
import View      from './view';

class SeparatorView extends View {
	constructor() {
		super();

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(SeparatorView.BLOCK_CLASS)
		);
	}
}

SeparatorView.BLOCK_CLASS = 'spv';

module.exports = SeparatorView;
