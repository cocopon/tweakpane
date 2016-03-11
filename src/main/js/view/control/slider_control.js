const MaxNumberConstraint = require('../../constraint/max_number_constraint');
const MinNumberConstraint = require('../../constraint/min_number_constraint');
const ClassName           = require('../../misc/class_name');
const Control             = require('./control');

class SliderControl extends Control {
	constructor(model) {
		super(model);

		this.addClass(ClassName.get(SliderControl.BLOCK_CLASS));

		const sliderElem = document.createElement('div');
		sliderElem.className = ClassName.get(SliderControl.BLOCK_CLASS, 'outer');
		sliderElem.addEventListener('mousedown', this.onSliderElementMouseDown_.bind(this));
		window.addEventListener('mousemove', this.onWindowMouseMove_.bind(this));
		window.addEventListener('mouseup', this.onWindowMouseUp_.bind(this));
		this.getElement().appendChild(sliderElem);
		this.sliderElem_ = sliderElem;

		const sliderBarElem = document.createElement('div');
		sliderBarElem.className = ClassName.get(SliderControl.BLOCK_CLASS, 'inner');
		this.sliderElem_.appendChild(sliderBarElem);
		this.sliderBarElem_ = sliderBarElem;

		this.captured_ = false;
	}

	applyModel_() {
		super.applyModel_();

		if (this.sliderBarElem_ !== undefined) {
			const model = this.getModel();
			const minValue = model.findConstraintByClass(MinNumberConstraint).getMinValue();
			const maxValue = model.findConstraintByClass(MaxNumberConstraint).getMaxValue();
			const p = (model.getValue() - minValue) / (maxValue - minValue);
			this.sliderBarElem_.style.width = `${p * 100}%`;
		}
	}

	getValueFromX_(x) {
		const model = this.getModel();
		const minValue = model.findConstraintByClass(MinNumberConstraint).getMinValue();
		const maxValue = model.findConstraintByClass(MaxNumberConstraint).getMaxValue();
		const width = this.sliderElem_.clientWidth;
		const p = Math.min(Math.max(x / width, 0), 1.0);
		return minValue + (maxValue - minValue) * p;
	}

	onSliderElementMouseDown_(e) {
		if (this.isDisabled()) {
			return;
		}

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
}

SliderControl.BLOCK_CLASS = 'sc';

module.exports = SliderControl;
