interface Config {
	buttonElement: HTMLElement;
	menuElement: HTMLElement;
}

export class SpMenu {
	private buttonElem_: HTMLElement;
	private menuElem_: HTMLElement;
	private expanded_ = false;

	constructor(config: Config) {
		this.onDocumentClick_ = this.onDocumentClick_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);
		this.onWindowHashChange_ = this.onWindowHashChange_.bind(this);
		this.onWindowScroll_ = this.onWindowScroll_.bind(this);

		this.buttonElem_ = config.buttonElement;
		this.menuElem_ = config.menuElement;

		this.menuElem_.classList.add('common-menu-loaded');

		document.addEventListener('click', this.onDocumentClick_);
		window.addEventListener('hashchange', this.onWindowHashChange_);
		window.addEventListener('scroll', this.onWindowScroll_);
		this.buttonElem_.addEventListener('click', this.onButtonClick_);

		this.updateActiveItem_();
	}

	get expanded(): boolean {
		return this.expanded_;
	}

	set expanded(expanded: boolean) {
		this.expanded_ = expanded;

		if (this.expanded_) {
			this.menuElem_.classList.add('common-menu-expanded');
		} else {
			this.menuElem_.classList.remove('common-menu-expanded');
		}
	}

	private updateActiveItem_(): void {
		const classNames = ['common-menuItem_anchor', 'common-submenuItem_anchor'];

		classNames.forEach((className) => {
			const activeClass = `${className}-active`;
			const elems: HTMLElement[] = Array.prototype.slice.call(
				document.querySelectorAll(`.${activeClass}`),
			);
			elems.forEach((elem) => {
				elem.classList.remove(activeClass);
			});
		});

		classNames.forEach((className: string) => {
			const comps = location.pathname.split('/');
			const lastComp = comps[comps.length - 1];
			const href = lastComp + location.hash;
			const elems = document.querySelector(`.${className}[href='${href}']`);
			if (elems) {
				elems.classList.add(`${className}-active`);
			}
		});
	}

	private onDocumentClick_(ev: MouseEvent): void {
		const elem = ev.target as HTMLElement;
		if (this.menuElem_.contains(elem)) {
			return;
		}
		if (elem === this.buttonElem_ || this.buttonElem_.contains(elem)) {
			return;
		}
		if (!this.expanded) {
			return;
		}

		ev.preventDefault();
		ev.stopImmediatePropagation();
		this.expanded = false;
	}

	private onWindowScroll_(): void {
		this.expanded = false;
	}

	private onWindowHashChange_(): void {
		this.updateActiveItem_();
	}

	private onButtonClick_(): void {
		this.expanded = true;
	}
}
