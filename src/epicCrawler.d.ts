import { epicLinkCrawler, options } from "epic-link-crawler";
import { ITEMS } from "epic-storage";
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
    headings: string[];
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
    protected url: string | null;
    protected crawledLinks: string[];
    protected errorLinks: string[];
    protected blobCache: any;
    protected htmlCache: any;
    protected options: crawlerOptions;
    protected data: never[];
    protected contentCache: ITEMS;
    epicLinkCrawler: epicLinkCrawler;
    constructor();
    init: (url: string, { depth, strict, cache }?: options) => Promise<unknown>;
    protected getTitle: () => any;
    protected getHeadings: () => string[];
    protected canonical: () => any;
    protected getGeo: () => object;
    protected getMetaTags: (tagname: string, type: metaType) => string | null;
    protected collectImages: () => string[];
    protected getAlts: () => string[];
    protected getStrong: () => string[];
    protected generateData: (url: string) => CRAWL;
    blackList: (fingerPrintList: (string | RegExp)[]) => epicLinkCrawler;
    clearCache: () => epicLinkCrawler;
    crawl: () => Promise<crawlArray>;
}
//# sourceMappingURL=epicCrawler.d.ts.map