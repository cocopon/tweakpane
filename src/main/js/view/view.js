const EventEmitter = require('../misc/event_emitter');

class View {
	constructor() {
		this.emitter_ = new EventEmitter();
		this.subviews_ = [];
		this.parentView_ = null;
		this.classes_ = [];

		this.createElement_();
	}

	createElement_() {
		if (this.elem_ !== undefined) {
			return;
		}
		this.elem_ = document.createElement('div');
	}

	getContainerElement_() {
		return this.elem_;
	}

	addClass(className) {
		this.classes_.push(className);
		this.applyClass_();
	}

	removeClass(className) {
		this.classes_ = this.classes_.filter((c) => {
			return c !== className;
		});
		this.applyClass_();
	}

	applyClass_() {
		this.elem_.className = this.classes_.join(' ');
	}

	/**
	 * @return {HTMLElement}
	 */
	getElement() {
		return this.elem_;
	}

	/**
	 * @return {View[]}
	 */
	getSubviews() {
		return this.subviews_;
	}

	getEmitter() {
		return this.emitter_;
	}

	/**
	 * @param {View} subview
	 */
	addSubview(subview) {
		if (this.subviews_.indexOf(subview) >= 0) {
			return;
		}

		this.subviews_.push(subview);
		subview.parentView_ = this;
		this.getContainerElement_().appendChild(subview.getElement());
	}

	removeSubview(subview) {
		const index = this.subviews_.indexOf(subview);
		if (index < 0) {
			return;
		}

		const elem = subview.getElement();
		if (elem !== null && elem.parentNode !== null) {
			elem.parentNode.removeChild(elem);
		}
		this.subviews_.splice(index, 1);

		subview.parentView_ = null;
	}

	removeFromParent() {
		if (this.parentView_ !== null) {
			this.parentView_.removeSubview(this);
		}
	}
}

module.exports = View;
