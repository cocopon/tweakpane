import {Constraint} from '../../../common/constraint/constraint';
import {PointNdAssembly} from '../model/point-nd';

interface Config<PointNd> {
	assembly: PointNdAssembly<PointNd>;
	components: (Constraint<number> | undefined)[];
}

/**
 * @hidden
 */
export class PointNdConstraint<PointNd> implements Constraint<PointNd> {
	public readonly components: (Constraint<number> | undefined)[];
	private readonly asm_: PointNdAssembly<PointNd>;

	constructor(config: Config<PointNd>) {
		this.components = config.components;
		this.asm_ = config.assembly;
	}

	public constrain(value: PointNd): PointNd {
		const comps = this.asm_
			.toComponents(value)
			.map((comp, index) => this.components[index]?.constrain(comp) ?? comp);
		return this.asm_.fromComponents(comps);
	}
}
