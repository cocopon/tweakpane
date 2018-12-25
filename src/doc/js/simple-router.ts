interface Route {
	init: () => void;
	pathname: RegExp;
}

export default class SimpleRouter {
	private routes_: Route[];

	constructor() {
		this.routes_ = [];
	}

	public add(route: Route): void {
		this.routes_.push(route);
	}

	public route(pathname: string): void {
		this.routes_.forEach((route) => {
			if (route.pathname.test(pathname)) {
				route.init();
			}
		});
	}
}
