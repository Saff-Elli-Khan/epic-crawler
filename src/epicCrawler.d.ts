import { epicLinkCrawler, options } from "epic-link-crawler";
export declare enum metaType {
    na = "none",
    og = "openGraph",
    tw = "twitter",
    ip = "itemprop"
}
export declare class epicCrawler {
    protected elc: epicLinkCrawler;
    protected crawledLinks: string[];
    protected errorLinks: string[];
    protected blobCache: any;
    protected htmlCache: any;
    protected data: never[];
    constructor(url: string, { depth, strict }?: options);
    protected getTitle: () => any;
    protected canonical: () => any;
    protected getGeo: () => object;
    protected getMetaTags: (tagname: string, type: metaType) => string | null;
    protected collectImages: () => string[];
    protected getAlts: () => string[];
    protected getStrong: () => string[];
    protected generateData: (url: string) => any;
    crawl: () => Promise<unknown>;
}
//# sourceMappingURL=epicCrawler.d.ts.map