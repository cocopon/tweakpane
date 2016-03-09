class Errors {
	static notImplemented(methodName) {
		const e = new Error(
			`'${methodName}' not implemented.`
		);
		e.name = 'Seasoner:NotImplementedError';
		return e;
	}

	static constraintAlreadyExists() {
		const e = new Error(
			'Same type of constraint already exists.'
		);
		e.name = 'Seasoner:ConstraintAlreadyExistsError';
		return e;
	}

	static duplicatedPropertyId(propertyId) {
		const e = new Error([
			`Found duplicated identifier: '${propertyId}'`,
			'Use `id()` to change an identifier of the duplicated property.'
		].join('\n'));
		e.name = 'Seasoner:DuplicatedPropertyIdError'
		return e;
	}

	static propertyTypeNotSupported(propertyName, value) {
		const e = new Error([
			`Property type not supported: '${propertyName}'`,
			String(value)
		].join('\n'));
		e.name = 'Seasoner.propertyTypeNotSupportedError';
		return e;
	}

	static propertyNotFound(propertyName) {
		const e = new Error([
			`Property not found: '${propertyName}'`,
		].join('\n'));
		e.name = 'Seasoner.PropertyNotFound';
		return e;
	}
}

module.exports = Errors;
