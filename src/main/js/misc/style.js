const ClassName = require('./class_name');

class Style {
	/**
	 * Injects a default style for Tweakpane.
	 */
	static injectDefault() {
		if (document.getElementById(this.ELEMENT_ID) !== null) {
			return;
		}

		const styleElem = document.createElement('style');
		styleElem.id = this.ELEMENT_ID;
		styleElem.textContent = this.CSS;
		document.head.appendChild(styleElem);
	}

	/**
	 * Returns a transition duration of a specified property of an element.
	 * @param {HTMLElement} element An element
	 * @param {string} propertyName A property name
	 * @return {number} A transition duration or 0 if not found a declaration
	 * 
	 */
	static getTransitionDuration(element) {
		// e.g. '0.2s, 0.4s, 0.4s'
		const durationValue = window.getComputedStyle(element).transitionDuration;
		return durationValue.split(',').map((stringValue) => {
			const floatValue = parseFloat(stringValue);
			return !isNaN(floatValue) ? (floatValue * 1000) : 0;
		}).reduce((maxValue, floatValue) => {
			return Math.max(maxValue, floatValue);
		}, 0);
	}

	/**
	 * Sets transition enabled.
	 * @param {HTMLElement} element An element
	 * @param {boolean} enabled Transition enabled
	 */
	static setTransitionEnabled(element, enabled) {
		if (enabled) {
			element.classList.remove(ClassName.get('NoTransition'));
		}
		else {
			element.classList.add(ClassName.get('NoTransition'));
		}
	}

	/**
	 * Apply style changes separately.
	 * Useful for complex CSS transition.
	 * @param {HTMLElement} element A target element
	 * @param {Function[]} callbacks An array of callback functions to change a style of a target element
	 */
	static runSeparately(element, callbacks) {
		callbacks.forEach((callback) => {
			callback(element);

			// Force reflow of the target element
			// http://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
			element.offsetHeight;
		});
	}
}

Style.ELEMENT_ID = 'tpDefaultStyle';
Style.CSS = '.css_replace_me{}';

module.exports = Style;
