class Errors {
	static notImplemented(methodName) {
		const e = new Error(
			`'${methodName}' not implemented.`
		);
		e.name = 'Tweakpane:NotImplementedError';
		return e;
	}

	static constraintAlreadyExists() {
		const e = new Error(
			'Same type of constraint already exists.'
		);
		e.name = 'Tweakpane:ConstraintAlreadyExistsError';
		return e;
	}

	static duplicatedPropertyId(propertyId) {
		const e = new Error([
			`Found duplicated identifier: '${propertyId}'`,
			'Use `id()` to change an identifier of the duplicated property.'
		].join('\n'));
		e.name = 'Tweakpane:DuplicatedPropertyIdError'
		return e;
	}

	static propertyNotFound(propertyName) {
		const e = new Error(
			`Property not found: '${propertyName}'`
		);
		e.name = 'Tweakpane.propertyNotFoundError';
		return e;
	}

	static propertyTypeNotSupported(propertyName, value) {
		const e = new Error([
			`Property type not supported: '${propertyName}'`,
			String(value)
		].join('\n'));
		e.name = 'Tweakpane.propertyTypeNotSupportedError';
		return e;
	}

	static propertyNotFound(propertyName) {
		const e = new Error(
			`Property not found: '${propertyName}'`
		);
		e.name = 'Tweakpane.PropertyNotFound';
		return e;
	}

	static invalidArgument(argumentName, value) {
		const e = new Error(
			`Invalid argument: ${argumentName} = ${value}`
		);
		e.name = 'Tweakpane.InvalidArgument';
		return e;
	}
}

module.exports = Errors;
