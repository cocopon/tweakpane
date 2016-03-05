const View = require('../view/view');

class Controller {
	constructor() {
		this.subcons_ = [];
		this.view_ = this.instanciateView_();
	}

	instanciateView_() {
		return new View();
	}

	getView() {
		return this.view_;
	}

	getSubcontrollers() {
		return this.subcons_;
	}

	addSubcontroller(subcontroller) {
		if (this.subcons_.indexOf(subcontroller) >= 0) {
			return;
		}

		this.subcons_.push(subcontroller);
		this.view_.addSubview(subcontroller.getView());
	}

	removeSubcontroller(subcontroller) {
		const index = this.subcons_.indexOf(subcontroller);
		if (index < 0) {
			return;
		}

		const view = subcontroller.getView();
		view.removeFromParent();
		this.subcons_.splice(index, 1);
	}
}

module.exports = Controller;
