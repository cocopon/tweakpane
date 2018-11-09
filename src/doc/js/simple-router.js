// @flow

type Route = {
	init: () => void,
	pathname: string,
};

export default class SimpleRouter {
	routes_: Route[];

	constructor() {
		this.routes_ = [];
	}

	add(route: Route): void {
		this.routes_.push(route);
	}

	route(pathname: string): void {
		this.routes_.forEach((route) => {
			if (route.pathname === pathname) {
				route.init();
			}
		});
	}
}
