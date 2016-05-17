/* global PIXI: false */
const HEIGHT = 400;

class Hof {
	static zip(a1, a2) {
		return a1.map((i1, index) => {
			return (index < a2.length) ?
				[i1, a2[index]] :
				null;
		}).filter((i) => {
			return (i !== null);
		});
	}
}

class Cube extends PIXI.Container {
	constructor(sprite, textureOffset, zHeight) {
		super();

		this.addChild(sprite);
		sprite.y = textureOffset;
		sprite.anchor = new PIXI.Point(0.5, 0.0);

		this.zHeight = zHeight;

		this.z = 0;
		this.vz = 0;
	}

	update(params) {
		this.vz += params.deltaT * -params.gravity;
		this.vz *= 1.0 - params.airResistance;

		this.z += params.deltaT * this.vz;
		if (this.z < 0) {
			this.z = 0;
			this.vz *= -params.restitution;
		}

		this.y = -Math.round(this.z);
	}
}

class Nigiri extends PIXI.Container {
	constructor(netaName) {
		super();

		this.cubes_ = [
			{id: 'shari',  textureOffset: -12, zHeight: 6},
			{id: 'sabi',   textureOffset: -3,  zHeight: 0},
			{id: netaName, textureOffset: -12, zHeight: 6}
		].map((config) => {
			return new Cube(
				PIXI.Sprite.fromImage(`assets/img/${config.id}.png`),
				config.textureOffset,
				config.zHeight
			);
		});

		this.cubes_.forEach((cube, index) => {
			cube.z = index * 30;
			this.addChild(cube);
		});
	}

	getNeta() {
		return this.cubes_[this.cubes_.length - 1];
	}

	pop() {
		this.cubes_.forEach((cube, index) => {
			cube.vz += index * 2;
		});
	}

	update(params) {
		this.cubes_.forEach((cube) => {
			cube.update(params);
		});

		Hof.zip(this.cubes_, this.cubes_.slice(1)).forEach((pair) => {
			const cl = pair[0];
			const ch = pair[1];

			if (ch.z < cl.z + cl.zHeight) {
				ch.z = cl.z + cl.zHeight;
				ch.vz *= -params.restitution;
			}
		});
	}
}

class Sketch {
	constructor(canvasElement) {
		this.renderer_ = PIXI.autoDetectRenderer(0, 0, {
			antialias: true,
			transparent: true,
			view: canvasElement
		});

		this.params_ = {
			airResistance: 0.01,
			deltaT: 0.5,
			gravity: 0.5,
			restitution: 0.5,
			neta: 'maguro'
		};

		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

		this.stage_ = new PIXI.Container();
		this.stage_.scale = new PIXI.Point(5, 5);

		this.nigiri_ = new Nigiri(this.params_.neta);
		this.stage_.addChild(this.nigiri_);

		this.updateHandler_ = this.onUpdate_.bind(this);
		this.onUpdate_();

		window.addEventListener(
			'resize',
			this.onWindowResize_.bind(this)
		);
		this.fitToContainer_();
	}

	getParameters() {
		return this.params_;
	}

	getNigiri() {
		return this.nigiri_;
	}

	onUpdate_() {
		requestAnimationFrame(this.updateHandler_);

		this.nigiri_.update(this.params_);

		this.renderer_.render(this.stage_);
	}

	fitToContainer_() {
		const containerElem = this.renderer_.view.parentNode;
		const bound = containerElem.getBoundingClientRect();
		const w = bound.width;
		const h = HEIGHT;
		this.renderer_.resize(w, h);

		this.stage_.x = w / 2;
		this.stage_.y = h * 2 / 3;

		const canvasElem = this.renderer_.view;
		canvasElem.width = w;
		canvasElem.height = h;
	}

	onWindowResize_() {
		this.fitToContainer_();
	}
}
