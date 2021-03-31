export interface PointNdAssembly<PointNd> {
	toComponents: (p: PointNd) => number[];
	fromComponents: (comps: number[]) => PointNd;
}
