export function randomTextExample(text: string): string {
    const arr = text.split(' ');
    const res: string[] = [];
    while (res.length < arr.length) {
        const randomNumber = Math.floor(Math.random() * arr.length);
        if (!res.includes(arr[randomNumber])) {
            res.push(arr[randomNumber]);
        }
    }
    return Array.from(res).join(' ');
}

export function randomIndex(count: number) {
    const res: number[] = [];
    while (res.length < count) {
        const randomNumber = Math.floor(Math.random() * count);
        if (!res.includes(randomNumber)) {
            res.push(randomNumber);
        }
    }

    return res;
}
