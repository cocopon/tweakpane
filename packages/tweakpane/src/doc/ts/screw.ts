export class Screw {
	elem_: HTMLElement;

	constructor(elem: HTMLElement) {
		this.onWindowScroll_ = this.onWindowScroll_.bind(this);

		this.elem_ = elem;

		window.addEventListener('scroll', this.onWindowScroll_);
	}

	onWindowScroll_() {
		const angle = window.scrollY * 0.5;
		this.elem_.style.transform = `rotate(${angle}deg)`;
	}
}