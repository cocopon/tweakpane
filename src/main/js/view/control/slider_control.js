import MaxNumberConstraint from '../../constraint/max_number_constraint';
import MinNumberConstraint from '../../constraint/min_number_constraint';
import ClassName           from '../../misc/class_name';
import Control             from './control';

class SliderControl extends Control {
	constructor(property) {
		super(property);

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(SliderControl.BLOCK_CLASS)
		);

		const sliderElem = document.createElement('div');
		sliderElem.classList.add(ClassName.get(SliderControl.BLOCK_CLASS, 'outer'));
		const supportsTouch = (sliderElem.ontouchstart !== undefined);
		if (supportsTouch) {
			sliderElem.addEventListener(
				'touchstart',
				this.onElementTouchStart_.bind(this)
			);
			sliderElem.addEventListener(
				'touchmove',
				this.onElementTouchMove_.bind(this)
			);
		}
		else {
			sliderElem.addEventListener(
				'mousedown',
				this.onElementMouseDown_.bind(this)
			);
			window.addEventListener(
				'mousemove',
				this.onWindowMouseMove_.bind(this)
			);
			window.addEventListener(
				'mouseup',
				this.onWindowMouseUp_.bind(this)
			);
		}
		elem.appendChild(sliderElem);
		this.sliderElem_ = sliderElem;

		const sliderBarElem = document.createElement('div');
		sliderBarElem.classList.add(
			ClassName.get(SliderControl.BLOCK_CLASS, 'inner')
		);
		this.sliderElem_.appendChild(sliderBarElem);
		this.sliderBarElem_ = sliderBarElem;

		this.captured_ = false;

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		if (this.sliderBarElem_ !== undefined) {
			const model = this.getProperty().getModel();
			const minValue = model.findConstraintByClass(MinNumberConstraint).getMinValue();
			const maxValue = model.findConstraintByClass(MaxNumberConstraint).getMaxValue();
			const p = (model.getValue() - minValue) / (maxValue - minValue);
			this.sliderBarElem_.style.width = `${p * 100}%`;
		}
	}

	getValueFromX_(x) {
		const model = this.getProperty().getModel();
		const minValue = model.findConstraintByClass(MinNumberConstraint).getMinValue();
		const maxValue = model.findConstraintByClass(MaxNumberConstraint).getMaxValue();
		const width = this.sliderElem_.clientWidth;
		const p = Math.min(Math.max(x / width, 0), 1.0);
		return minValue + (maxValue - minValue) * p;
	}

	onElementMouseDown_(e) {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.getValueFromX_(e.offsetX)]
		);

		this.captured_ = true;
	}

	onWindowMouseMove_(e) {
		if (!this.captured_) {
			return;
		}

		const elemLeft = window.scrollX + this.getElement().getBoundingClientRect().left;
		const offsetX = e.pageX - elemLeft;
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.getValueFromX_(offsetX)]
		);
	}

	onWindowMouseUp_() {
		this.captured_ = false;
	}

	onElementTouchStart_(e) {
		// Prevent default event to prevent native scroll
		e.preventDefault();

		const bound = e.target.getBoundingClientRect();
		const offsetX = e.targetTouches[0].clientX - bound.left;
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.getValueFromX_(offsetX)]
		);
	}

	onElementTouchMove_(e) {
		const bound = e.target.getBoundingClientRect();
		const offsetX = e.targetTouches[0].clientX - bound.left;
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.getValueFromX_(offsetX)]
		);
	}
}

SliderControl.BLOCK_CLASS = 'slc';

export default SliderControl;
