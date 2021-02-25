import {supportsTouch} from '../dom-util';
import {Emitter} from '../model/emitter';

/**
 * Data for pointer events.
 */
export interface PointerData {
	/**
	 * The size of the bounds.
	 */
	bounds: {
		height: number;
		width: number;
	};
	/**
	 * The X coordinate in the element.
	 */
	x: number;
	/**
	 * The Y coordinate in the element.
	 */
	y: number;
}

function computeOffset(ev: MouseEvent, elem: HTMLElement): [number, number] {
	// NOTE: OffsetX/Y should be computed from page and window properties to capture mouse events
	const win = elem.ownerDocument.defaultView;
	const rect = elem.getBoundingClientRect();
	return [
		ev.pageX - (((win && win.scrollX) || 0) + rect.left),
		ev.pageY - (((win && win.scrollY) || 0) + rect.top),
	];
}

/**
 * An event for PointerHandler.
 */
export interface PointerHandlerEvent {
	data: PointerData;
	sender: PointerHandler;
}

export interface PointerHandlerEvents {
	down: PointerHandlerEvent;
	move: PointerHandlerEvent;
	up: PointerHandlerEvent;
}

/**
 * A utility class to handle both mouse and touch events.
 */
export class PointerHandler {
	public readonly emitter: Emitter<PointerHandlerEvents>;
	public readonly element: HTMLElement;
	private pressed_: boolean;

	constructor(element: HTMLElement) {
		this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
		this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
		this.onMouseDown_ = this.onMouseDown_.bind(this);
		this.onTouchMove_ = this.onTouchMove_.bind(this);
		this.onTouchStart_ = this.onTouchStart_.bind(this);

		this.element = element;
		this.emitter = new Emitter();
		this.pressed_ = false;

		const doc = this.element.ownerDocument;
		if (supportsTouch(doc)) {
			element.addEventListener('touchstart', this.onTouchStart_);
			element.addEventListener('touchmove', this.onTouchMove_);
		} else {
			element.addEventListener('mousedown', this.onMouseDown_);
			doc.addEventListener('mousemove', this.onDocumentMouseMove_);
			doc.addEventListener('mouseup', this.onDocumentMouseUp_);
		}
	}

	private computePosition_(offsetX: number, offsetY: number): PointerData {
		const rect = this.element.getBoundingClientRect();
		return {
			bounds: {
				width: rect.width,
				height: rect.height,
			},
			x: offsetX,
			y: offsetY,
		};
	}

	private onMouseDown_(e: MouseEvent): void {
		// Prevent native text selection
		e.preventDefault();

		(e.currentTarget as HTMLElement | null)?.focus();

		this.pressed_ = true;

		this.emitter.emit('down', {
			data: this.computePosition_(...computeOffset(e, this.element)),
			sender: this,
		});
	}

	private onDocumentMouseMove_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}

		this.emitter.emit('move', {
			data: this.computePosition_(...computeOffset(e, this.element)),
			sender: this,
		});
	}

	private onDocumentMouseUp_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}
		this.pressed_ = false;

		this.emitter.emit('up', {
			data: this.computePosition_(...computeOffset(e, this.element)),
			sender: this,
		});
	}

	private onTouchStart_(e: TouchEvent) {
		// Prevent native page scroll
		e.preventDefault();

		const touch = e.targetTouches[0];
		const rect = this.element.getBoundingClientRect();
		this.emitter.emit('down', {
			data: this.computePosition_(
				touch.clientX - rect.left,
				touch.clientY - rect.top,
			),
			sender: this,
		});
	}

	private onTouchMove_(e: TouchEvent) {
		const touch = e.targetTouches[0];
		const rect = this.element.getBoundingClientRect();
		this.emitter.emit('move', {
			data: this.computePosition_(
				touch.clientX - rect.left,
				touch.clientY - rect.top,
			),
			sender: this,
		});
	}
}
