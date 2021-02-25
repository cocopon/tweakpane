const PREFIX = 'tp';

/**
 * A utility function for generating BEM-like class name.
 * @param viewName The name of the view. Used as part of the block name.
 * @return A class name generator function.
 */
export function ClassName(viewName: string) {
	/**
	 * Generates a class name.
	 * @param [opt_elementName] The name of the element.
	 * @param [opt_modifier] The name of the modifier.
	 * @return A class name.
	 */
	const fn = (opt_elementName?: string, opt_modifier?: string): string => {
		return [
			PREFIX,
			'-',
			viewName,
			'v',
			opt_elementName ? `_${opt_elementName}` : '',
			opt_modifier ? `-${opt_modifier}` : '',
		].join('');
	};
	return fn;
}
