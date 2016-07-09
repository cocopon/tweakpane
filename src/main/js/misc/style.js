import ClassName from './class_name';

class Style {
	/**
	 * Returns a transition duration of a specified property of an element.
	 * @param {HTMLElement} element An element
	 * @param {string} propertyName A property name
	 * @return {number} A transition duration or 0 if not found a declaration
	 * 
	 */
	static getMaxTransitionDuration(element) {
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
	 * Run CSS transition certainly.
	 * @param {HTMLElement} element A target element
	 * @param {Function} callback Callback function for transition
	 * @param {boolean} animated true for enabling animation
	 */
	static runTransition(element, callback, animated) {
		// If !animated, disable CSS transition temporarily
		this.setTransitionEnabled(element, animated);
		this.forceReflow_(element);

		callback(element);

		// Re-enable transition
		this.forceReflow_(element);
		this.setTransitionEnabled(element, true);
	}

	/**
	 * Force reflow an element.
	 * Useful for applying transition change.
	 * @see http://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
	 * @private
	 * @param {HTMLElement} element An element
	 */
	static forceReflow_(element) {
		element.offsetHeight;
	}
}

export default Style;
