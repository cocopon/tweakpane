const ClassName     = require('../../misc/class_name');
const Control       = require('./control');

class CompositeControl extends Control {
	constructor(model) {
		super(model);
	}

	applyDisabled_() {
		super.applyDisabled_();

		const disabled = this.isDisabled();
		this.getSubviews().forEach((subview) => {
			if (subview instanceof Control) {
				subview.setDisabled(disabled);
			}
		});
	}

	attachControl_(control) {
		control.getEmitter().on(
			Control.EVENT_CHANGE,
			this.onSubcontrolChange_,
			this
		);
	}

	detachControl_(control) {
		control.getEmitter().off(
			Control.EVENT_CHANGE,
			this.onSubcontrolChange_,
			this
		);
	}

	addSubview(subview) {
		const added = super.addSubview(subview);
		if (!added) {
			return false;
		}

		if (subview instanceof Control) {
			this.attachControl_(subview);
		}

		return true;
	}

	removeSubview(subview) {
		const removed = super.removeSubview(subview);
		if (!removed) {
			return false;
		}

		if (subview instanceof Control) {
			this.detachControl_(subview);
		}

		return true;
	}

	onSubcontrolChange_(value) {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[value]
		);
	}
}

module.exports = CompositeControl;
