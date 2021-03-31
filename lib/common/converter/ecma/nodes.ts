export interface Evaluable {
	evaluate: () => number;
}

export class NumberLiteralNode implements Evaluable {
	public readonly text: string;

	constructor(text: string) {
		this.text = text;
	}

	public evaluate(): number {
		return Number(this.text);
	}

	public toString(): string {
		return this.text;
	}
}

const BINARY_OPERATION_MAP: {
	[op: string]: (v1: number, v2: number) => number;
} = {
	'**': (v1, v2) => v1 ** v2,
	'*': (v1, v2) => v1 * v2,
	'/': (v1, v2) => v1 / v2,
	'%': (v1, v2) => v1 % v2,
	'+': (v1, v2) => v1 + v2,
	'-': (v1, v2) => v1 - v2,
	'<<': (v1, v2) => v1 << v2,
	'>>': (v1, v2) => v1 >> v2,
	'>>>': (v1, v2) => v1 >>> v2,
	'&': (v1, v2) => v1 & v2,
	'^': (v1, v2) => v1 ^ v2,
	'|': (v1, v2) => v1 | v2,
};

export class BinaryOperationNode implements Evaluable {
	public readonly left: Evaluable;
	public readonly operator: string;
	public readonly right: Evaluable;

	constructor(operator: string, left: Evaluable, right: Evaluable) {
		this.left = left;
		this.operator = operator;
		this.right = right;
	}

	public evaluate(): number {
		const op = BINARY_OPERATION_MAP[this.operator];
		if (!op) {
			throw new Error(`unexpected binary operator: '${this.operator}`);
		}
		return op(this.left.evaluate(), this.right.evaluate());
	}

	public toString(): string {
		return [
			'b(',
			this.left.toString(),
			this.operator,
			this.right.toString(),
			')',
		].join(' ');
	}
}

const UNARY_OPERATION_MAP: {[op: string]: (v: number) => number} = {
	'+': (v) => v,
	'-': (v) => -v,
	'~': (v) => ~v,
};

export class UnaryOperationNode implements Evaluable {
	public readonly operator: string;
	public readonly expression: Evaluable;

	constructor(operator: string, expr: Evaluable) {
		this.operator = operator;
		this.expression = expr;
	}

	public evaluate() {
		const op = UNARY_OPERATION_MAP[this.operator];
		if (!op) {
			throw new Error(`unexpected unary operator: '${this.operator}`);
		}
		return op(this.expression.evaluate());
	}

	public toString(): string {
		return ['u(', this.operator, this.expression.toString(), ')'].join(' ');
	}
}
