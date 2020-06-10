import { epicLinkCrawler, options } from "epic-link-crawler";
export declare enum metaType {
    na = "none",
    og = "openGraph",
    tw = "twitter",
    ip = "itemprop"
}
export declare type CRAWL = {
    url: string | null;
    canonical: string | null;
    type: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
    images: string[];
    keywords: string | null;
    author: string | null;
    strong: string[];
    alt: string[];
    geo: object;
};
export declare type crawlArray = CRAWL[];
export declare type crawlerOptions = options;
export declare class epicCrawler {
    protected elc: epicLinkCrawler;
    protected crawledLinks: string[];
    protected errorLinks: string[];
    protected blobCache: any;
    protected htmlCache: any;
    protected data: never[];
    constructor(url: string, { depth, strict }?: crawlerOptions);
    protected getTitle: () => any;
    protected canonical: () => any;
    protected getGeo: () => object;
    protected getMetaTags: (tagname: string, type: metaType) => string | null;
    protected collectImages: () => string[];
    protected getAlts: () => string[];
    protected getStrong: () => string[];
    protected generateData: (url: string) => CRAWL;
    clearCache: () => epicLinkCrawler;
    crawl: () => Promise<unknown>;
}
//# sourceMappingURL=epicCrawler.d.ts.map