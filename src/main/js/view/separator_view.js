const ClassName = require('../misc/class_name');
const View      = require('./view');

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
