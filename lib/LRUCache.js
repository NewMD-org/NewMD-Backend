import LRU from 'lru-cache';
const cache = new LRU(10);

export const CGet = async (key, callback) => {
    let resp = cache.get(key)

    if (resp) return resp;
    await callback()
        .then(data => {
            resp = data;
            cache.set(key, data);
        });
    return resp;
}