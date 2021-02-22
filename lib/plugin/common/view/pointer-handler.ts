import {supportsTouch} from '../dom-util';
import {Emitter} from '../model/emitter';

export interface PointerData {
	px: number;
	py: number;
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
 * @hidden
 */
export interface PointerHandlerEvents {
	down: {
		data: PointerData;
		sender: PointerHandler;
	};
	move: {
		data: PointerData;
		sender: PointerHandler;
	};
	up: {
		data: PointerData;
		sender: PointerHandler;
	};
}

/**
 * A utility class to handle both mouse and touch events.
 * @hidden
 */
export class PointerHandler {
	public readonly document: Document;
	public readonly emitter: Emitter<PointerHandlerEvents>;
	public readonly element: HTMLElement;
	private pressed_: boolean;

	constructor(doc: Document, element: HTMLElement) {
		this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
		this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
		this.onMouseDown_ = this.onMouseDown_.bind(this);
		this.onTouchMove_ = this.onTouchMove_.bind(this);
		this.onTouchStart_ = this.onTouchStart_.bind(this);

		this.document = doc;
		this.element = element;
		this.emitter = new Emitter();
		this.pressed_ = false;

		if (supportsTouch(this.document)) {
			element.addEventListener('touchstart', this.onTouchStart_);
			element.addEventListener('touchmove', this.onTouchMove_);
		} else {
			element.addEventListener('mousedown', this.onMouseDown_);
			this.document.addEventListener('mousemove', this.onDocumentMouseMove_);
			this.document.addEventListener('mouseup', this.onDocumentMouseUp_);
		}
	}

	private computePosition_(offsetX: number, offsetY: number): PointerData {
		const rect = this.element.getBoundingClientRect();
		return {
			px: offsetX / rect.width,
			py: offsetY / rect.height,
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
