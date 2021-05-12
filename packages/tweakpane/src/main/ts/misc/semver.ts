/***
 * A simple semantic versioning perser.
 */
export class Semver {
	public readonly major: number;
	public readonly minor: number;
	public readonly patch: number;
	public readonly prerelease: string | null;

	/**
	 * @hidden
	 */
	constructor(text: string) {
		const [core, prerelease] = text.split('-');
		const coreComps = core.split('.');
		this.major = parseInt(coreComps[0], 10);
		this.minor = parseInt(coreComps[1], 10);
		this.patch = parseInt(coreComps[2], 10);
		this.prerelease = prerelease ?? null;
	}

	public toString(): string {
		const core = [this.major, this.minor, this.patch].join('.');
		return this.prerelease !== null ? [core, this.prerelease].join('-') : core;
	}
}
