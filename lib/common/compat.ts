export function warnDeprecation(info: {
	name: string;
	alternative?: string;
	postscript?: string;
}) {
	console.warn(
		[
			`${info.name} is deprecated.`,
			info.alternative ? `use ${info.alternative} instead.` : '',
			info.postscript ?? '',
		].join(' '),
	);
}
