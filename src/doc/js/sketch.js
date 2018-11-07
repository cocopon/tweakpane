// @flow

declare var PIXI: any;

function map(v: number, s1: number, e1: number, s2:number, e2: number): number {
	return s2 + (v - s1) / (e1 - s1) * (e2 - s2);
}

function dist(x1: number, y1: number, x2: number, y2: number): number {
	const dx = x2 - x1;
	const dy = y2 - y1;
	return Math.sqrt(dx * dx + dy * dy);
}

export type Environment = {
	color: string,
	maxSize: number,
	range: number,
	spacing: number,
	speed: number,
	xamp: number,
	xfreq: number,
	yamp: number,
	yfreq: number,
};

const DEFAULT_DOT_SIZE = 20;

export default class Sketch {
	app_: PIXI.Application;
	dots_: PIXI.Sprite[];
	elem_: HTMLElement;
	env_: Environment;
	height_: number;
	t_: number;
	width_: number;

	constructor(element: HTMLElement, env: Environment) {
		this.elem_ = element;
		this.env_ = env;

		this.dots_ = [];
		this.t_ = 0;

		this.app_ = new PIXI.Application({
			transparent: true,
		});
		this.elem_.appendChild(this.app_.renderer.view);

		window.addEventListener('resize', () => {
			this.resize();
		});
		this.resize();

		this.app_.ticker.add(() => {
			this.onTick_();
		});
	}

	reset() {
		const w = this.width_;
		const h = this.height_;
		const env = this.env_;

		const g = new PIXI.Graphics();
		const color = parseInt(env.color.substring(1), 16);
		g.beginFill(color)
			.drawCircle(0, 0, DEFAULT_DOT_SIZE)
			.endFill();
		const tex = g.generateCanvasTexture();

		this.app_.stage.removeChildren();
		this.dots_ = [];

		const xstep = env.spacing;
		const ystep = xstep * Math.sqrt(3) / 2;
		const xcount = Math.ceil(w / xstep);
		const ycount = Math.ceil(h / ystep);
		for (let iy = 0; iy <= ycount; iy++) {
			for (let ix = 0; ix <= xcount; ix++) {
				const dot = new PIXI.Sprite(tex);
				dot.anchor.set(0.5, 0.5);
				dot.x = (ix + (iy % 2 === 0 ? 0 : 0.5)) * xstep;
				dot.y = iy * ystep;
				this.app_.stage.addChild(dot);
				this.dots_.push(dot);
			}
		}
	}

	onTick_() {
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
			const wx = p * w + Math.sin(p * env.xfreq + t) * env.xamp * w;
			const py = Math.sin(t + p * env.yfreq);
			const wy = h / 2 + py * env.yamp * h;

			this.dots_.forEach((dot) => {
				const d = dist(dot.x, dot.y, wx, wy);
				dot.en += Math.pow(env.range, d * 0.1);
			});
		}

		this.dots_.forEach((dot) => {
			const sz = (1 - Math.pow(0.9, dot.en)) * env.maxSize / DEFAULT_DOT_SIZE;
			dot.scale.set(sz);
		});
	}

	resize() {
		const rect = this.elem_.getBoundingClientRect();
		this.height_ = rect.height;
		this.width_ = rect.width;

		this.app_.renderer.resize(
			this.width_,
			this.height_,
		);
		this.reset();
	}
};
