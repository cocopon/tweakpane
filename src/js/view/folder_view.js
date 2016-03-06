const ClassName = require('../misc/class_name');
const View      = require('./view');

class FolderView extends View {
	constructor() {
		super();

		this.title_ = '';
		this.setExpanded(true, false);
	}

	createElement_() {
		super.createElement_();

		this.addClass(ClassName.get('FolderView'));

		const elem = this.getElement();

		const titleElem = document.createElement('div');
		titleElem.className += ClassName.get('FolderView', 'title');
		titleElem.addEventListener('click', this.onTitleElementClick_.bind(this));
		elem.appendChild(titleElem);
		this.titleElem_ = titleElem;

		const containerElem = document.createElement('div');
		containerElem.className += ClassName.get('FolderView', 'container');
		elem.appendChild(containerElem);
		this.containerElem_ = containerElem;
	}

	getContainerElement_() {
		return this.containerElem_;
	}

	isExpanded() {
		return this.expanded_;
	}

	setExpanded(expanded, opt_animated) {
		this.expanded_ = expanded;
		this.applyExpanded_(opt_animated);
	}

	applyExpandingAnimationEnabled_(enabled) {
		let classes = this.containerElem_.className.split(' ');
		let className = ClassName.get('FolderView', 'container', 'animated');
		if (enabled) {
			if (classes.indexOf(className) < 0) {
				classes.push(className);
			}
		}
		else {
			classes = classes.filter((klass) => {
				return klass !== className;
			});
		}

		this.containerElem_.className = classes.join(' ');
	}

	applyExpanded_(opt_animated) {
		const animated = (opt_animated !== undefined) ?
			opt_animated :
			true;
		this.applyExpandingAnimationEnabled_(animated);

		const contentHeight = this.expanded_ ?
			this.getContentHeight_() :
			0;
		this.containerElem_.style.height = `${contentHeight}px`;
	}

	getTitle() {
		return this.title_;
	}

	setTitle(title) {
		this.title_ = title;
		this.applyTitle_();
	}

	applyTitle_() {
		this.titleElem_.textContent = this.title_;
	}

	getContentHeight_() {
		return this.subviews_.reduce((prevValue, curValue) => {
			return prevValue + curValue.getElement().offsetHeight;
		}, 0);
	}

	addSubview(subview) {
		super.addSubview(subview);
		this.applyExpanded_(false);
	}

	onTitleElementClick_() {
		this.setExpanded(!this.isExpanded());
	}
}

module.exports = FolderView;
