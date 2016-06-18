/* global PIXI: false */

const MASS = 1.0;
const DT = 0.3;
const SPRING_K = 1.0;
const MASS_COUNT = 20;
const AIR_REGISTANCE = 0.95;
const MAX_VEL = 100;

class PVector {
	static dist(p1, p2) {
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	static mag(p) {
		return this.dist(this.ZERO, p);
	}

	static normalize(p) {
		const d = this.mag(p);
		return (d !== 0) ?
			new PIXI.Point(
				p.x / d,
				p.y / d
			) :
			p.clone();
	}
}
PVector.ZERO = new PIXI.Point();

class Mass {
	constructor() {
		this.pos = new PIXI.Point();
		this.vel = new PIXI.Point();
		this.acc = new PIXI.Point();
	}

	reset() {
		this.acc.x = 0;
		this.acc.y = 0;
	}

	update() {
		// v = v0 + a * t
		this.vel.x += this.acc.x * DT;
		this.vel.y += this.acc.y * DT;

		this.vel.x *= AIR_REGISTANCE;
		this.vel.y *= AIR_REGISTANCE;
		if (PVector.mag(this.vel) > MAX_VEL) {
			this.vel = PVector.normalize(this.vel);
			this.vel.x *= MAX_VEL;
			this.vel.y *= MAX_VEL;
		}

		// x = x0 + v * t
		this.pos.x += this.vel.x * DT;
		this.pos.y += this.vel.y * DT;
	}
}

class Spring {
	constructor(m1, m2) {
		this.m1 = m1;
		this.m2 = m2;

		this.updateNaturalLength();
	}

	updateNaturalLength() {
		this.nLen_ = PVector.dist(
			this.m1.pos,
			this.m2.pos
		);
	}

	update() {
		// f = k * dl
		const len = PVector.dist(
			this.m1.pos,
			this.m2.pos
		);
		const dl = len - this.nLen_;
		const f = SPRING_K * dl;

		const nv = PVector.normalize(
			new PIXI.Point(
				this.m2.pos.x - this.m1.pos.x,
				this.m2.pos.y - this.m1.pos.y
			)
		);
		const nx = nv.x;
		const ny = nv.y;

		// a = f / m
		this.m1.acc.x += +nx * f / MASS;
		this.m1.acc.y += +ny * f / MASS;
		this.m2.acc.x += -nx * f / MASS;
		this.m2.acc.y += -ny * f / MASS;
	}
}

class Engine {
	constructor() {
		this.masses = [];
		this.springs = [];
	}

	update() {
		this.masses.forEach((m) => {
			m.reset();
		});

		this.springs.forEach((s) => {
			s.update();
		});
		this.masses.forEach((m) => {
			m.update();
		});
	}
}

class PhysicsSketch {
	constructor(canvasElement) {
		this.renderer_ = PIXI.autoDetectRenderer(0, 0, {
			antialias: true,
			transparent: true,
			view: canvasElement
		});

		this.stage_ = new PIXI.Container();

		const bg = new PIXI.Graphics();
		this.stage_.addChild(bg);
		this.bg_ = bg;

		const g = new PIXI.Graphics();
		this.stage_.addChild(g);
		this.g_ = g;

		this.level_ = 0;

		window.addEventListener(
			'resize',
			this.onWindowResize_.bind(this)
		);
		this.fitToContainer_();

		const engine = new Engine();
		for (let i = 0; i < MASS_COUNT; i++) {
			const mass = new Mass();
			mass.pos.x = 0;
			mass.pos.y = canvasElement.height * i / (MASS_COUNT - 1);
			engine.masses.push(mass);
		}
		for (let j = 0; j < MASS_COUNT; j++) {
			for (let i = j + 1; i < MASS_COUNT; i++) {
				engine.springs.push(new Spring(
					engine.masses[i],
					engine.masses[j]
				));
			}
		}
		this.engine_ = engine;

		this.updateHandler_ = this.onUpdate_.bind(this);
		this.onUpdate_();
	}

	updateLevel(level) {
		this.level_ = level;
	}

	onUpdate_() {
		requestAnimationFrame(this.updateHandler_);

		const engine = this.engine_;
		engine.update();

		const w = this.renderer_.view.width;
		const h = this.renderer_.view.height;
		const targetX = w * this.level_;
		engine.masses[0].pos.x += (targetX - engine.masses[0].pos.x) * 0.3;
		engine.masses[0].pos.y = 0;
		engine.masses[engine.masses.length - 1].pos.y = h;

		engine.masses.forEach((m) => {
			m.pos.x = Math.min(Math.max(m.pos.x, 0), w);
			m.pos.y = Math.min(Math.max(m.pos.y, 0), h);
		});

		const g = this.g_;
		g.clear();
		g.beginFill(PhysicsSketch.FG_COLOR);
		g.moveTo(0, 0);
		g.lineTo(engine.masses[0].pos.x, 0);
		engine.masses.forEach((m) => {
			g.lineTo(m.pos.x, m.pos.y);
		});
		g.lineTo(engine.masses[engine.masses.length - 1].pos.x, h);
		g.lineTo(0, h);
		g.endFill();

		this.renderer_.render(this.stage_);
	}

	fitToContainer_() {
		const containerElem = this.renderer_.view.parentNode;
		const bound = containerElem.getBoundingClientRect();
		const w = bound.width;
		const h = bound.height;
		this.renderer_.resize(w, h);

		this.bg_.clear();
		this.bg_.beginFill(PhysicsSketch.BG_COLOR);
		this.bg_.drawRect(0, 0, w, h);
		this.bg_.endFill();

		const canvasElem = this.renderer_.view;
		canvasElem.width = w;
		canvasElem.height = h;
	}

	onWindowResize_() {
		this.fitToContainer_();
	}
}
PhysicsSketch.BG_COLOR = 0xdddde4;
PhysicsSketch.FG_COLOR = 0xc3c3d0;
