import { epicLinkCrawler } from "epic-link-crawler";
import tesseract from "tesseract.js";
declare type options = {
    depth?: Number;
    strict?: Boolean;
    ocr?: Boolean;
};
declare enum metaType {
    na = "none",
    og = "openGraph",
    tw = "twitter",
    ip = "itemprop"
}
export declare class epicCrawler {
    protected elc: epicLinkCrawler;
    protected crawledLinks: string[];
    protected errorLinks: string[];
    protected ocrEngine: typeof tesseract;
    protected ocr: Boolean;
    protected blobCache: any;
    protected htmlCache: any;
    protected data: never[];
    constructor(url: string, { depth, strict, ocr }?: options);
    protected getTitle: () => any;
    protected canonical: () => any;
    protected getGeo: () => object;
    protected ocrImages: () => Promise<unknown>;
    protected getMetaTags: (tagname: string, type: metaType) => string | null;
    protected collectImages: () => string[];
    protected getAlts: () => string[];
    protected getStrong: () => string[];
    protected generateData: (url: string) => Promise<unknown>;
    crawl: () => Promise<unknown>;
}
export {};
//# sourceMappingURL=epicCrawler.d.ts.map