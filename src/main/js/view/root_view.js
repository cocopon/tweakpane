const ClassName = require('../misc/class_name');
const View      = require('./view');

class RootView extends View {
	constructor() {
		super();

		this.getElement().classList.add(ClassName.get(''));
	}
}

RootView.BLOCK_CLASS = 'rv';

module.exports = RootView;
