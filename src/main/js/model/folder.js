import Model from './model';

class Folder extends Model {
	constructor() {
		super();

		this.expanded_ = true;
		this.shouldAnimate_ = true;
	}

	isExpanded() {
		return this.expanded_;
	}

	shouldAnimate() {
		return this.shouldAnimate_;
	}

	setExpanded(expanded, opt_shouldAnimate) {
		this.expanded_ = expanded;
		this.shouldAnimate_ = (opt_shouldAnimate !== undefined) ?
			opt_shouldAnimate :
			false;

		this.getEmitter().notifyObservers(
			Model.EVENT_CHANGE
		);
	}
}

export default Folder;
