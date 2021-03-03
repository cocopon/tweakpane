/***
 * A simple semantic versioning perser.
 */
export class Semver {
	public readonly major: number;
	public readonly minor: number;
	public readonly patch: number;

	constructor(text: string) {
		const comps = text.split('.');
		this.major = parseInt(comps[0], 10);
		this.minor = parseInt(comps[1], 10);
		this.patch = parseInt(comps[2], 10);
	}

	public toString(): string {
		return [this.major, this.minor, this.patch].join('.');
	}
}
