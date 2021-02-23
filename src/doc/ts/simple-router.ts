interface Route {
	init: () => void;
	pathname: RegExp;
}

export class SimpleRouter {
	private routes_: Route[];

	constructor() {
		this.routes_ = [];
	}

	public add(pathname: RegExp, callback: () => void): void {
		this.routes_.push({
			init: callback,
			pathname: pathname,
		});
	}

	public route(pathname: string): void {
		this.routes_.forEach((route) => {
			if (route.pathname.test(pathname)) {
				route.init();
			}
		});
	}
}
