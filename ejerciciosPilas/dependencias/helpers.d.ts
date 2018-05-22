interface Math {
    randomIntBetween(start: number, end: number): number;
    randomFrom<T>(array: Array<T>): T;
    takeRandomFrom<T>(array: Array<T>): T;
}
