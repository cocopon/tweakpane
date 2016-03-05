class Fluent {
	constructor(controller) {
		this.controller_ = controller;
	}

	getController() {
		return this.controller_;
	}
}

module.exports = Fluent;
