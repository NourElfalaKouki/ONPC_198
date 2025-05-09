import uid from './uid';


it('should return a string', () => {
    const id = uid(18);
    expect(typeof id).toBe('string');
});

it('should generate random strings', () => {
    const items = Array(10000)
        .fill(0)
        .map(() => uid(6));
    for (const item of items) {
        const matches = items.filter(s => s === item);
        expect(matches).toHaveLength(1);
    }
});

it('should return a uid of the correct length', () => {
    const id = uid(18);
    expect(byteLength(id)).toBe(24);
});

it('should use 12 bytes as default length if not provided', () => {
    const id = uid();
    expect(byteLength(id)).toBe(16);
});

it('should not contain +, /, or =', () => {
    const id = uid(10000);
    expect(id.indexOf('+')).toBe(-1);
    expect(id.indexOf('/')).toBe(-1);
    expect(id.indexOf('=')).toBe(-1);
});


/**
 * @see https://stackoverflow.com/a/23329386/1092007
 * @returns The byte length of an utf8 string
 */
function byteLength(str: string) {
    let s = str.length;
    for (let i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);

        if (code > 0x7f && code <= 0x7ff) {
            s++;
        } else if (code > 0x7ff && code <= 0xffff) {
            s += 2;
        }

        if (code >= 0xDC00 && code <= 0xDFFF) {
            i--; // Trail surrogate
        }
    }
    return s;
}
