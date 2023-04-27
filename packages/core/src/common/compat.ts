import {Semver} from '../misc/semver.js';
import {VERSION} from '../version.js';

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

export function warnMissing(info: {
	key: string;
	target: string;
	place: string;
}) {
	console.warn(
		[
			`Missing '${info.key}' of ${info.target} in ${info.place}.`,
			'Please rebuild plugins with the latest core package.',
		].join(' '),
	);
}

export function isCompatible(ver: Semver | undefined): boolean {
	if (!ver) {
		// Version 1.x
		return false;
	}
	return ver.major === VERSION.major;
}
