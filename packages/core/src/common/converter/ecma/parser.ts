import {
	BinaryOperationNode,
	Evaluable,
	NumberLiteralNode,
	UnaryOperationNode,
} from './nodes';
import {readNumericLiteral, readWhitespace} from './reader';

interface ParsingResult {
	cursor: number;
	evaluable: Evaluable;
}

type Parser = (text: string, cursor: number) => ParsingResult | null;

function parseLiteral(text: string, cursor: number): ParsingResult | null {
	const num = readNumericLiteral(text, cursor);
	cursor += num.length;
	if (num === '') {
		return null;
	}

	return {
		evaluable: new NumberLiteralNode(num),
		cursor: cursor,
	};
}

function parseParenthesizedExpression(
	text: string,
	cursor: number,
): ParsingResult | null {
	const op = text.substr(cursor, 1);
	cursor += op.length;
	if (op !== '(') {
		return null;
	}

	const expr = parseExpression(text, cursor);
	if (!expr) {
		return null;
	}
	cursor = expr.cursor;
	cursor += readWhitespace(text, cursor).length;

	const cl = text.substr(cursor, 1);
	cursor += cl.length;
	if (cl !== ')') {
		return null;
	}

	return {
		evaluable: expr.evaluable,
		cursor: cursor,
	};
}

function parsePrimaryExpression(
	text: string,
	cursor: number,
): ParsingResult | null {
	return (
		parseLiteral(text, cursor) ?? parseParenthesizedExpression(text, cursor)
	);
}

function parseUnaryExpression(
	text: string,
	cursor: number,
): ParsingResult | null {
	const expr = parsePrimaryExpression(text, cursor);
	if (expr) {
		return expr;
	}

	const op = text.substr(cursor, 1);
	cursor += op.length;
	if (op !== '+' && op !== '-' && op !== '~') {
		return null;
	}

	const num = parseUnaryExpression(text, cursor);
	if (!num) {
		return null;
	}
	cursor = num.cursor;

	return {
		cursor: cursor,
		evaluable: new UnaryOperationNode(op, num.evaluable),
	};
}

function readBinaryOperator(
	ops: string[],
	text: string,
	cursor: number,
): {cursor: number; operator: string} | null {
	cursor += readWhitespace(text, cursor).length;

	const op = ops.filter((op) => text.startsWith(op, cursor))[0];
	if (!op) {
		return null;
	}

	cursor += op.length;
	cursor += readWhitespace(text, cursor).length;

	return {
		cursor: cursor,
		operator: op,
	};
}

function createBinaryOperationExpressionParser(
	exprParser: Parser,
	ops: string[],
): Parser {
	return (text: string, cursor: number): ParsingResult | null => {
		const firstExpr = exprParser(text, cursor);
		if (!firstExpr) {
			return null;
		}
		cursor = firstExpr.cursor;

		let expr = firstExpr.evaluable;

		for (;;) {
			const op = readBinaryOperator(ops, text, cursor);
			if (!op) {
				break;
			}
			cursor = op.cursor;

			const nextExpr = exprParser(text, cursor);
			if (!nextExpr) {
				return null;
			}
			cursor = nextExpr.cursor;

			expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
		}

		return expr
			? {
					cursor: cursor,
					evaluable: expr,
			  }
			: null;
	};
}

const parseBinaryOperationExpression = [
	['**'],
	['*', '/', '%'],
	['+', '-'],
	['<<', '>>>', '>>'],
	['&'],
	['^'],
	['|'],
].reduce((parser: Parser, ops: string[]) => {
	return createBinaryOperationExpressionParser(parser, ops);
}, parseUnaryExpression);

function parseExpression(text: string, cursor: number): ParsingResult | null {
	cursor += readWhitespace(text, cursor).length;
	return parseBinaryOperationExpression(text, cursor);
}

/**
 * Parse ECMAScript expression with numeric literals.
 * https://262.ecma-international.org/
 * @param text The string to be parsed.
 * @return A parsing result, or null if failed.
 */
export function parseEcmaNumberExpression(text: string): Evaluable | null {
	const expr = parseExpression(text, 0);
	if (!expr) {
		return null;
	}

	const cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
	if (cursor !== text.length) {
		return null;
	}

	return expr.evaluable;
}
