import Control from './control';

class CompositeControl extends Control {
	constructor(property) {
		super(property);
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

export default CompositeControl;
