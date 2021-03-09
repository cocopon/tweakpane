type Reader = (text: string, cursor: number) => string;

function combineReader(parsers: Reader[]): Reader {
	return (text: string, cursor: number): string => {
		for (let i = 0; i < parsers.length; i++) {
			const result = parsers[i](text, cursor);
			if (result !== '') {
				return result;
			}
		}
		return '';
	};
}

export function readWhitespace(text: string, cursor: number): string {
	const m = text.substr(cursor).match(/^\s+/);
	return (m && m[0]) ?? '';
}

function readNonZeroDigit(text: string, cursor: number): string {
	const ch = text.substr(cursor, 1);
	return ch.match(/^[1-9]$/) ? ch : '';
}

function readDecimalDigits(text: string, cursor: number): string {
	const m = text.substr(cursor).match(/^[0-9]+/);
	return (m && m[0]) ?? '';
}

function readSignedInteger(text: string, cursor: number): string {
	const ds = readDecimalDigits(text, cursor);
	if (ds !== '') {
		return ds;
	}

	const sign = text.substr(cursor, 1);
	cursor += 1;
	if (sign !== '-' && sign !== '+') {
		return '';
	}

	const sds = readDecimalDigits(text, cursor);
	if (sds === '') {
		return '';
	}

	return sign + sds;
}

function readExponentPart(text: string, cursor: number): string {
	const result = [];

	const e = text.substr(cursor, 1);
	cursor += 1;
	if (e.toLowerCase() !== 'e') {
		return '';
	}
	result.push(e);

	const si = readSignedInteger(text, cursor);
	if (si === '') {
		return '';
	}

	return e + si;
}

function readDecimalIntegerLiteral(text: string, cursor: number): string {
	const ch = text.substr(cursor, 1);
	if (ch === '0') {
		return ch;
	}

	const nzd = readNonZeroDigit(text, cursor);
	cursor += nzd.length;
	if (nzd === '') {
		return '';
	}

	return nzd + readDecimalDigits(text, cursor);
}

function readDecimalLiteral1(text: string, cursor: number): string {
	const dil = readDecimalIntegerLiteral(text, cursor);
	cursor += dil.length;
	if (dil === '') {
		return '';
	}

	const dot = text.substr(cursor, 1);
	cursor += dot.length;
	if (dot !== '.') {
		return '';
	}

	const dds = readDecimalDigits(text, cursor);
	cursor += dds.length;

	return dil + dot + dds + readExponentPart(text, cursor);
}

function readDecimalLiteral2(text: string, cursor: number): string {
	const dot = text.substr(cursor, 1);
	cursor += dot.length;
	if (dot !== '.') {
		return '';
	}

	const dds = readDecimalDigits(text, cursor);
	cursor += dds.length;
	if (dds === '') {
		return '';
	}

	return dot + dds + readExponentPart(text, cursor);
}

function readDecimalLiteral3(text: string, cursor: number): string {
	const dil = readDecimalIntegerLiteral(text, cursor);
	cursor += dil.length;
	if (dil === '') {
		return '';
	}

	return dil + readExponentPart(text, cursor);
}

const readDecimalLiteral = combineReader([
	readDecimalLiteral1,
	readDecimalLiteral2,
	readDecimalLiteral3,
]);

function parseBinaryDigits(text: string, cursor: number): string {
	const m = text.substr(cursor).match(/^[01]+/);
	return (m && m[0]) ?? '';
}

function readBinaryIntegerLiteral(text: string, cursor: number): string {
	const prefix = text.substr(cursor, 2);
	cursor += prefix.length;
	if (prefix.toLowerCase() !== '0b') {
		return '';
	}

	const bds = parseBinaryDigits(text, cursor);
	if (bds === '') {
		return '';
	}

	return prefix + bds;
}

function readOctalDigits(text: string, cursor: number): string {
	const m = text.substr(cursor).match(/^[0-7]+/);
	return (m && m[0]) ?? '';
}

function readOctalIntegerLiteral(text: string, cursor: number): string {
	const prefix = text.substr(cursor, 2);
	cursor += prefix.length;
	if (prefix.toLowerCase() !== '0o') {
		return '';
	}

	const ods = readOctalDigits(text, cursor);
	if (ods === '') {
		return '';
	}

	return prefix + ods;
}

function readHexDigits(text: string, cursor: number): string {
	const m = text.substr(cursor).match(/^[0-9a-f]+/i);
	return (m && m[0]) ?? '';
}

function readHexIntegerLiteral(text: string, cursor: number): string {
	const prefix = text.substr(cursor, 2);
	cursor += prefix.length;
	if (prefix.toLowerCase() !== '0x') {
		return '';
	}

	const hds = readHexDigits(text, cursor);
	if (hds === '') {
		return '';
	}

	return prefix + hds;
}

const readNonDecimalIntegerLiteral = combineReader([
	readBinaryIntegerLiteral,
	readOctalIntegerLiteral,
	readHexIntegerLiteral,
]);

export const readNumericLiteral = combineReader([
	readNonDecimalIntegerLiteral,
	readDecimalLiteral,
]);
