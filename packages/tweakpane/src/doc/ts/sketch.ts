import {SVG_NS} from '@tweakpane/core';

function map(
	v: number,
	s1: number,
	e1: number,
	s2: number,
	e2: number,
): number {
	return s2 + ((v - s1) / (e1 - s1)) * (e2 - s2);
}

function dist(x1: number, y1: number, x2: number, y2: number): number {
	const dx = x2 - x1;
	const dy = y2 - y1;
	return Math.sqrt(dx * dx + dy * dy);
}

export interface Environment {
	amp: {x: number; y: number};
	color: string;
	freq: {x: number; y: number};
	maxSize: number;
	range: number;
	spacing: number;
	speed: number;
	title: string;
}

class Dot {
	public readonly element: SVGCircleElement;
	public x = 0;
	public y = 0;
	public en = 0;
	private readonly env_: Environment;

	constructor(env: Environment) {
		this.element = document.createElementNS(SVG_NS, 'circle');
		this.env_ = env;
	}

	public update(): void {
		this.element.setAttributeNS(null, 'cx', `${this.x}px`);
		this.element.setAttributeNS(null, 'cy', `${this.y}px`);

		const sz = map(1 - Math.pow(0.9, this.en), 0, 1, 1, this.env_.maxSize);
		this.element.setAttributeNS(null, 'r', `${sz}px`);
	}
}

export class Sketch {
	private readonly elem_: Element;
	private readonly svgElem_: SVGElement;
	private readonly env_: Environment;
	private dots_: Dot[];
	private dotsElem_: SVGGElement;
	private height_ = 0;
	private t_: number;
	private width_ = 0;

	constructor(element: Element, env: Environment) {
		this.onTick_ = this.onTick_.bind(this);

		this.elem_ = element;
		this.env_ = env;

		this.dots_ = [];
		this.t_ = 0;

		const svgElem = document.createElementNS(SVG_NS, 'svg');
		this.elem_.appendChild(svgElem);
		this.svgElem_ = svgElem;

		this.dotsElem_ = document.createElementNS(SVG_NS, 'g');
		this.svgElem_.appendChild(this.dotsElem_);

		window.addEventListener('resize', () => {
			this.resize();
		});
		this.resize();

		this.onTick_();
	}

	public reset() {
		const w = this.width_;
		const h = this.height_;
		const env = this.env_;

		this.dots_ = [];

		const xstep = env.spacing;
		const ystep = (xstep * Math.sqrt(3)) / 2;
		const xcount = Math.ceil(w / xstep);
		const ycount = Math.ceil(h / ystep);
		const newDotsElem = document.createElementNS(SVG_NS, 'g') as SVGGElement;
		newDotsElem.setAttributeNS(null, 'fill', env.color);
		for (let iy = 0; iy <= ycount; iy++) {
			for (let ix = 0; ix <= xcount; ix++) {
				const dot = new Dot(env);
				dot.en = 0;
				dot.x = ix * xstep;
				dot.y = iy * ystep;
				newDotsElem.appendChild(dot.element);
				this.dots_.push(dot);
			}
		}
		this.svgElem_.appendChild(newDotsElem);
		this.svgElem_.removeChild(this.dotsElem_);
		this.dotsElem_ = newDotsElem;
	}

	public resize() {
		const rect = this.elem_.getBoundingClientRect();
		this.height_ = rect.height;
		this.width_ = rect.width;

		this.reset();
	}

	private onTick_() {
		const w = this.width_;
		const h = this.height_;
		const env = this.env_;

		this.dots_.forEach((dot) => {
			dot.en = 0;
		});

		this.t_ -= env.speed;
		const t = this.t_;

		for (let iw = 0; iw <= 100; iw++) {
			const p = map(iw, 0, 100, 0, 1);
			const wx = p * w + Math.sin(p * env.freq.x + t) * env.amp.x * w;
			const py = Math.sin(t + p * env.freq.y);
			const wy = h / 2 + py * env.amp.y * h;

			this.dots_.forEach((dot) => {
				const d = dist(dot.x, dot.y, wx, wy);
				dot.en += Math.pow(env.range, d * 0.1);
			});
		}

		this.dots_.forEach((dot) => {
			dot.update();
		});

		requestAnimationFrame(this.onTick_);
	}
}
