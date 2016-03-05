const MaxNumberFormatter = require('../../formatter/max_number_formatter');
const MinNumberFormatter = require('../../formatter/min_number_formatter');
const Control            = require('./control');

class SliderControl extends Control {
	createElement_() {
		super.createElement_();

		this.addClass('sliderControl');

		const sliderElem = document.createElement('div');
		sliderElem.className += 'sliderControl_outer';
		sliderElem.addEventListener('mousedown', this.onSliderElementMouseDown_.bind(this));
		sliderElem.addEventListener('mousemove', this.onSliderElementMouseMove_.bind(this));
		sliderElem.addEventListener('mouseup', this.onSliderElementMouseUp_.bind(this));
		this.getElement().appendChild(sliderElem);
		this.sliderElem_ = sliderElem;

		const sliderBarElem = document.createElement('div');
		sliderBarElem.className += 'sliderControl_inner';
		this.sliderElem_.appendChild(sliderBarElem);
		this.sliderBarElem_ = sliderBarElem;
	}

	applyModel_() {
		super.applyModel_();

		const model = this.getModel();
		const minValue = model.findFormatterByClass(MinNumberFormatter).getMinValue();
		const maxValue = model.findFormatterByClass(MaxNumberFormatter).getMaxValue();
		const p = (model.getValue() - minValue) / (maxValue - minValue);
		this.sliderBarElem_.style.width = `${p * 100}%`;
	}

	getValueFromX_(x) {
		const model = this.getModel();
		const minValue = model.findFormatterByClass(MinNumberFormatter).getMinValue();
		const maxValue = model.findFormatterByClass(MaxNumberFormatter).getMaxValue();
		const width = this.sliderElem_.clientWidth;
		const p = Math.min(Math.max(x / width, 0), 1.0);
		return minValue + (maxValue - minValue) * p;
	}

	onSliderElementMouseDown_(e) {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.getValueFromX_(e.offsetX)]
		);
	}

	onSliderElementMouseMove_(e) {
		if (e.which === 0) {
			return;
		}

		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.getValueFromX_(e.offsetX)]
		);
	}

	onSliderElementMouseUp_(e) {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.getValueFromX_(e.offsetX)]
		);
	}
}

module.exports = SliderControl;
