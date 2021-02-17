const PREFIX = 'tp';

export function ClassName(viewName: string) {
	return (opt_elementName?: string, opt_modifier?: string): string => {
		return [
			PREFIX,
			'-',
			viewName,
			'v',
			opt_elementName ? `_${opt_elementName}` : '',
			opt_modifier ? `-${opt_modifier}` : '',
		].join('');
	};
}
