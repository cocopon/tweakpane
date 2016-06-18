/* global PIXI: false */

const MAX_Z = 100;

// Use data URI to avoid cross-origin problem in file protocol
const RESOURCES = {
	'hotate': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAAXNSR0IArs4c6QAAARJJREFUOBGlkz0OgkAQRsFYmWiMsbeyxsSeE3gBa49gb2HvEbyE8QT2JlhbKdgZJRhrdDb5yP4x6woJGXb55r1lgSDwOB7JtqTToyUIfwnXQQeThbOfDdSB9UVxIqvgmSXKNpT3o860jm0iRaCvOBxOFdA/IiHQwQr1O2giCi+HTdnt9XWmdewrSrNb0CbSq8gF0CXCFkGEinmsisA4hACDpqJrsgOqqooAs76itOig1ahWAVIuUbUVvTFajMoKkNZFFRgBprZG8VL5F5is+Bh84NFsFSpw+mQ5Ad3Li7cZwRYVZ3GPwAhVF5igyok4QRTPDZ4x4RLZBPKK5X66ZgUIy08kCzgwer0qiU77tfM9ydAPfCF/1iRRiD8AAAAASUVORK5CYII=',
	'maguro': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAA80lEQVQ4T62UzwrCMAzGW0SkDLyIT+F77Lqb+IjibW+gD+LJm178w5ibyCSFSFqyNq3mNJrk+yVft2mVEJeqGqB8Wdda2iYqbNYbK+xHsdtG+4MFOHFs2tBGLEAq7IM5kAMYsyK2Qcg6C8idOAaGjfSxLIe5MbHarPz5elMWAN3TmVGLP4FO94d6t40dygG8utYe5m4EE0NMTBEGoB9SEApjnxgQs45aQS8pGeBbx1kxCoAEXDRcMgrRYv/82fXfNJ2UA6wOe+18aPhG/QoAYdRgfxUUlLIBFQ4CMMlZx1nECYsAFITPFBASTgJQEAAkwtjzAXKcpAX6oerPAAAAAElFTkSuQmCC',
	'sabi': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAASklEQVQIW2NkQAL779b/B3EdlRsZYcJgBkwCWTFMIePSfXn/peQF0eXA/MtnHzOATQApAtEwhSAJEMgLm8cItwum8O2bL2AJmJEA0Fwbo13ysiwAAAAASUVORK5CYII=',
	'salmon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAAAXNSR0IArs4c6QAAAT9JREFUOBGtVM2KwjAQHnWFsgiFXcHLIn2NBY8+iRffwItnL4IP4MUn2eOCL+Gh7p6EIghVi0W6mcAXmpC2DmvBTpP5fjKTRCLBc1+MC/4JKNR6BJytJ0U3+bGgeX9IwXTTyH+xWM4Aq82deQyR78y/Ko28BiBCqCkC7zOyDBjIpZPTjiYD5NHKspE2wAoA/G+EHhu1D/OR6FRIzOPZZ6ErSC6Z5vVfAwm/Evt7OpuctQdslKU3+jBp2ccuOVOvJM5sywBy0orMisN3SJjoNUAWRiEmnGiEnfnysNYAwINqW6Dahz1i4ZRUOwCoie3B4rvyFro8ruiRVYMXLbctXQFMnnVkWRgm5gMTHF2j7C2i4BhryDW/65iGQ3Vi7D/AsrAGqZd3D6QV+YRrDZCE0X4VeW97nTA0RJFbx9dfQvoDDOeDgXzY7XwAAAAASUVORK5CYII=',
	'shari': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAA/UlEQVQ4T6WV4a2EMAyDyQAMAHOwAPuLAbpAGYAB+uRIRiFX0pbHHzjR+LOT0pNp4Mo5Fyxf11V6y7oWllJU+DxP1V2WRe8i0qwPF9AxBT2Av6NEVcCb4zdAlOgB6HU8kkgBXx33JBK4bjn6+v44jkkBSHFd1zTP82OXtBy+vU8p3VqSUioQBgAXnv/j2OrgWQEUtilGElnHrCNIW1QT7kmEHnvHbDM1f2bQKkDayDHbTZBuU6aIWkVwzvmeVSv5tm3Ps4QDt7vKJwLAbwoP2vf9/oCrR0WUiAn8MAGFY3/KhoddLREAkeMhABfbRHYGNcefACxCIgBsj1t/PH9JQEAmgzxRSAAAAABJRU5ErkJggg=='
};

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
		else if (this.z > MAX_Z) {
			this.z = MAX_Z;
			this.vz *= -params.restitution;
		}
	}

	draw() {
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
			const image = new Image();
			image.src = RESOURCES[config.id];
			const baseTexture = new PIXI.BaseTexture(image);
			const texture = new PIXI.Texture(baseTexture);
			return new Cube(
				new PIXI.Sprite(texture),
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
		const energy = 2 + Math.random() * 2;
		this.cubes_.forEach((cube, index) => {
			cube.vz += index * energy;
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

		this.cubes_.forEach((cube) => {
			cube.draw();
		});
	}
}

class SushiSketch {
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
			neta: 'maguro',
			netaAlt: 0
		};

		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

		this.stage_ = new PIXI.Container();

		this.bg_ = new PIXI.Graphics();
		this.stage_.addChild(this.bg_);

		this.pxLayer_ = new PIXI.Container();
		this.pxLayer_.scale = new PIXI.Point(5, 5);
		this.stage_.addChild(this.pxLayer_);

		this.nigiri_ = new Nigiri(this.params_.neta);
		this.pxLayer_.addChild(this.nigiri_);

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

	refreshNeta() {
		this.nigiri_.parent.removeChild(this.nigiri_);

		this.nigiri_ = new Nigiri(this.params_.neta);
		this.pxLayer_.addChild(this.nigiri_);
	}

	pop() {
		this.nigiri_.pop();
	}

	onUpdate_() {
		requestAnimationFrame(this.updateHandler_);

		this.nigiri_.update(this.params_);
		this.params_.netaAlt = this.nigiri_.getNeta().z;

		this.renderer_.render(this.stage_);
	}

	fitToContainer_() {
		const containerElem = this.renderer_.view.parentNode;
		const bound = containerElem.getBoundingClientRect();
		const w = bound.width;
		const h = bound.height;
		this.renderer_.resize(w, h);

		this.pxLayer_.x = w / 2;
		this.pxLayer_.y = h * 2 / 3;

		this.bg_.clear();
		this.bg_.beginFill(SushiSketch.BG_COLOR);
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
SushiSketch.BG_COLOR = 0xffffff;
