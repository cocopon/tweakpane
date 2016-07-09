import EventEmitter from '../misc/event_emitter';

class View {
	constructor() {
		this.emitter_ = new EventEmitter();
		this.subviews_ = [];
		this.parentView_ = null;
		this.classes_ = [];

		this.elem_ = document.createElement('div');
	}

	/**
	 * Returns an element.
	 * @return {HTMLElement} An element
	 */
	getElement() {
		return this.elem_;
	}

	getContainerElement_() {
		return this.elem_;
	}

	/**
	 * Returns a parent view.
	 * @return {?View} A parent view
	 */
	getParentView() {
		return this.parentView_;
	}

	/**
	 * Returns all subviews.
	 * @return {View[]} Subviews
	 */
	getSubviews() {
		return this.subviews_;
	}

	getEmitter() {
		return this.emitter_;
	}

	/**
	 * Adds a subview.
	 * @param {View} subview A subview to add
	 * @return {boolean} True if the subview is added successfully
	 */
	addSubview(subview) {
		if (this.subviews_.indexOf(subview) >= 0) {
			return false;
		}

		this.subviews_.push(subview);
		subview.parentView_ = this;
		this.getContainerElement_().appendChild(subview.getElement());

		this.emitter_.notifyObservers(
			View.EVENT_ADD,
			[subview]
		);

		return true;
	}

	/**
	 * Removes a specified subview.
	 * @param {View} subview A subview to rmeove
	 * @return {boolean} True if the subview is removed successfully
	 */
	removeSubview(subview) {
		const index = this.subviews_.indexOf(subview);
		if (index < 0) {
			return false;
		}

		const elem = subview.getElement();
		if (elem !== null && elem.parentNode !== null) {
			elem.parentNode.removeChild(elem);
		}
		this.subviews_.splice(index, 1);

		subview.parentView_ = null;

		this.emitter_.notifyObservers(
			View.EVENT_REMOVE,
			[subview]
		);

		return true;
	}

	removeFromParent() {
		if (this.parentView_ !== null) {
			this.parentView_.removeSubview(this);
		}
	}
}

View.EVENT_ADD = 'add';
View.EVENT_REMOVE = 'remove';

export default View;
