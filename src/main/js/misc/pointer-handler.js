// @flow

import * as DomUtil from './dom-util';
import Emitter from './emitter';

type EventType = 'down' | 'move' | 'up';

export type PointerData = {
	px: number,
	py: number,
};

// Handles both mouse and touch events
export default class PointerHandler {
	+document: Document;
	+emitter: Emitter<EventType>;
	+element: HTMLElement;
	pressed_: boolean;

	constructor(document: Document, element: HTMLElement) {
		(this: any).onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
		(this: any).onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
		(this: any).onMouseDown_ = this.onMouseDown_.bind(this);
		(this: any).onTouchMove_ = this.onTouchMove_.bind(this);
		(this: any).onTouchStart_ = this.onTouchStart_.bind(this);

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

	computePosition_(offsetX: number, offsetY: number): PointerData {
		const rect = this.element.getBoundingClientRect();
		return {
			px: offsetX / rect.width,
			py: offsetY / rect.height,
		};
	}

	onMouseDown_(e: MouseEvent): void {
		// Prevent native text selection
		e.preventDefault();

		this.pressed_ = true;

		this.emitter.emit('down', [this.computePosition_(e.offsetX, e.offsetY)]);
	}

	onDocumentMouseMove_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}

		const win = this.document.defaultView;
		const rect = this.element.getBoundingClientRect();
		this.emitter.emit('move', [
			this.computePosition_(
				e.pageX - (win.scrollX + rect.left),
				e.pageY - (win.scrollY + rect.top),
			),
		]);
	}

	onDocumentMouseUp_(e: MouseEvent): void {
		if (!this.pressed_) {
			return;
		}
		this.pressed_ = false;

		const win = this.document.defaultView;
		const rect = this.element.getBoundingClientRect();
		this.emitter.emit('up', [
			this.computePosition_(
				e.pageX - (win.scrollX + rect.left),
				e.pageY - (win.scrollY + rect.top),
			),
		]);
	}

	onTouchStart_(e: TouchEvent) {
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

	onTouchMove_(e: TouchEvent) {
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
