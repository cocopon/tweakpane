import * as DomUtil from './dom-util';
import Emitter from './emitter';

type EventType = 'down' | 'move' | 'up';

export interface PointerData {
	px: number;
	py: number;
}

// Handles both mouse and touch events
export default class PointerHandler {
	public readonly document: Document;
	public readonly emitter: Emitter<EventType>;
	public readonly element: HTMLElement;
	private pressed_: boolean;

	constructor(document: Document, element: HTMLElement) {
		this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
		this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
		this.onMouseDown_ = this.onMouseDown_.bind(this);
		this.onTouchMove_ = this.onTouchMove_.bind(this);
		this.onTouchStart_ = this.onTouchStart_.bind(this);

		this.document = document;
		this.element = element;
		this.emitter = new Emitter();
		this.pressed_ = false;

		if (DomUtil.supportsTouch(this.document)) {
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

		this.pressed_ = true;

		this.emitter.emit('down', [this.computePosition_(e.offsetX, e.offsetY)]);
	}

	private onDocumentMouseMove_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}

		const win = this.document.defaultView;
		const rect = this.element.getBoundingClientRect();
		this.emitter.emit('move', [
			this.computePosition_(
				e.pageX - (((win && win.scrollX) || 0) + rect.left),
				e.pageY - (((win && win.scrollY) || 0) + rect.top),
			),
		]);
	}

	private onDocumentMouseUp_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}
		this.pressed_ = false;

		const win = this.document.defaultView;
		const rect = this.element.getBoundingClientRect();
		this.emitter.emit('up', [
			this.computePosition_(
				e.pageX - (((win && win.scrollX) || 0) + rect.left),
				e.pageY - (((win && win.scrollY) || 0) + rect.top),
			),
		]);
	}

	private onTouchStart_(e: TouchEvent) {
		// Prevent native page scroll
		e.preventDefault();

		const touch = e.targetTouches[0];
		const rect = this.element.getBoundingClientRect();
		this.emitter.emit('down', [
			this.computePosition_(
				touch.clientX - rect.left,
				touch.clientY - rect.top,
			),
		]);
	}

	private onTouchMove_(e: TouchEvent) {
		const touch = e.targetTouches[0];
		const rect = this.element.getBoundingClientRect();
		this.emitter.emit('move', [
			this.computePosition_(
				touch.clientX - rect.left,
				touch.clientY - rect.top,
			),
		]);
	}
}
