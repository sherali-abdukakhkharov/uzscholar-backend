import { isEmpty, isEqual, isObject, transform } from 'lodash';
import { Readable } from 'stream';

export function difference(new_data, old_data) {
	function changes(new_data, old_data) {
		return transform(new_data, (result, value, key) => {
			if (!isEqual(value, old_data[key])) {
				result[key] = isObject(value) && isObject(old_data[key]) ? changes(value, old_data[key]) : value;
			}
		});
	}

	return changes(new_data, old_data);
}

export function isJson(value) {
	try {
		if (value === null) return false;
		JSON.parse(value);
		return true;
	} catch (error) {
		return false;
	}
}

export function isExactFilter(columnName: string, filterValue: string, isExact: boolean) {
	const filter = filterValue?.replace(/'/g, "''");
	if (isEmpty(columnName) || isEmpty(filter)) {
		return `true`;
	}
	if (isExact) {
		return `${columnName}  =  '${filter}'`;
	}
	return `${columnName} ilike '%${filter}%'`;
}

export const diffSeconds = (sec, current) => {
	const sig = new Date(sec).getTime();
	return Math.floor((current - sig) / 1000);
};

export function kiril2latin(column, lang) {
	if (lang === 'uz_lat') return `kiril2latin(${column})`;
	return column;
}

export const base64Decode = (value) => Buffer.from(value, 'base64').toString('utf-8');

export const bufferToStream = (binary) => {
	return new Readable({
		read() {
			this.push(binary);
			this.push(null);
		},
	});
};

export const arrObjToStr = (array = [], key, separator = ', ') => {
	if (!Array.isArray(array)) return null;
	return array
		.map((obj) => obj[key])
		.filter((value) => value)
		.join(separator);
};

export const compareTwoArrays = (arr1, arr2) => {
	const N = arr1?.length;
	const M = arr2?.length;

	// If lengths of arrays are not equal
	if (N != M) return false;

	// Store arr1[] elements and their counts in
	// hash map
	const map = new Map();
	let count = 0;
	for (let i = 0; i < N; i++) {
		if (map.get(arr1[i]) == null) map.set(arr1[i], 1);
		else {
			count = map.get(arr1[i]);
			count++;
			map.set(arr1[i], count);
		}
	}

	// Traverse arr2[] elements and check if all
	// elements of arr2[] are present same number
	// of times or not.
	for (let i = 0; i < N; i++) {
		// If there is an element in arr2[], but
		// not in arr1[]
		if (!map.has(arr2[i])) return false;

		// If an element of arr2[] appears more
		// times than it appears in arr1[]
		if (map.get(arr2[i]) == 0) return false;

		count = map.get(arr2[i]);
		--count;
		map.set(arr2[i], count);
	}

	return true;
};

export function convertNumberToObjectId(number: number): string {
	const hexString: string = number.toString(16);

	const paddedHexString: string = hexString.padStart(6, '0');

	const objectId: string = paddedHexString + '64bef2a4f9499a00016f0714'?.substring(paddedHexString.length);

	return objectId;
}

export function generateExcelColumnRange(start: string, end: string) {
	const result = [];
	let current = start.toUpperCase();

	while (current !== nextColumn(end.toUpperCase())) {
		result.push(current);
		current = nextColumn(current);
	}

	return result;
}

function nextColumn(column) {
	const chars = column.split('');
	let i = chars.length - 1;

	while (i >= 0) {
		if (chars[i] === 'Z') {
			chars[i] = 'A';
			i--;
		} else {
			chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
			return chars.join('');
		}
	}

	// If we've overflowed (e.g., from 'Z' to 'AA'), add a new 'A' at the front
	return 'A' + chars.join('');
}

export function containsQueryParams(url) {
	if (url?.indexOf('?') != -1) return true;
	return false;
}

export const toBase64 = (body) => Buffer.from(body).toString('base64');

export const filterNonNull = (obj) => {
	for (const propName in obj) {
		if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
			delete obj[propName];
		}
	}
	return obj;
};

export const generateRandomCode = (chars_length = 2) => {
	const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < chars_length; i++) {
		result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
	}
	return result;
};

export function crc32(str: string): string {
	let crc = -1;
	for (let i = 0, len = str.length; i < len; i++) {
		crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xff];
	}
	return ((crc ^ -1) >>> 0).toString(16).padStart(8, '0');
}

const crcTable = (() => {
	const table = new Uint32Array(256);
	for (let i = 0; i < 256; i++) {
		let c = i;
		for (let j = 0; j < 8; j++) {
			c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		table[i] = c;
	}
	return table;
})();
