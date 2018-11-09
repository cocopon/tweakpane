// @flow

type ViewType = 'input' | 'monitor' | '';

const PREFIX = 'tp';
const TYPE_TO_POSTFIX_MAP: {[ViewType]: string} = {
	input: 'iv',
	monitor: 'mv',
	'': 'v',
};

export default function className(viewName: string, opt_viewType?: ViewType) {
	const viewType = opt_viewType || '';
	const postfix = TYPE_TO_POSTFIX_MAP[viewType];

	return (opt_elementName?: ?string, opt_modifier?: string): string => {
		return [
			PREFIX,
			'-',
			viewName,
			postfix,
			opt_elementName ? `_${opt_elementName}` : '',
			opt_modifier ? `-${opt_modifier}` : '',
		].join('');
	};
}
