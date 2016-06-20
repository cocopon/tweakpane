class ViewInterface {
	constructor(view) {
		this.view_ = view;
	}

	getView() {
		return this.view_;
	}
}

module.exports = ViewInterface;
