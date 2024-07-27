export const enum getDataType {
    level1 = 'wordCollectionLevel1.json',
    level2 = 'wordCollectionLevel2.json',
}

class GetJson {
    async getData(level: getDataType) {
        const result = await fetch(
            `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/data/${level}`,
        )
            .then((response) => response.json())
            .then((json) => json)
            .catch((err) => new Error(err));
        return result;
    }
}

export default GetJson;
