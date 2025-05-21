export function parseURL(u: string) {
    const url = new URL(u);
    console.log(url.searchParams.get('nick'));
    console.log(url.origin);
    console.log(url.host);
    console.log(url.hostname);
    console.log(url.hash);
}