type Matcher = (pathname: string) => boolean;

interface Route {
	init: () => void;
	matcher: Matcher;
}

export class SimpleRouter {
	private routes_: Route[];

	constructor() {
		this.routes_ = [];
	}

	public add(matcher: RegExp | Matcher, callback: () => void): void {
		this.routes_.push({
			init: callback,
			matcher:
				matcher instanceof RegExp
					? (pathname: string): boolean => {
							return matcher.test(pathname);
					  }
					: matcher,
		});
	}

	public route(pathname: string): void {
		this.routes_.forEach((route) => {
			if (route.matcher(pathname)) {
				route.init();
			}
		});
	}
}
