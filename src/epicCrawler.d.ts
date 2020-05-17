import { epicLinkCrawler } from 'epic-link-crawler';
declare type options = {
    depth?: Number;
    strict?: Boolean;
};
export declare class epicCrawler {
    protected elc: epicLinkCrawler;
    protected crawledLinks: string[];
    protected data: never[];
    constructor(url: string, { depth, strict }?: options);
    crawl: () => Promise<unknown>;
}
export {};
//# sourceMappingURL=epicCrawler.d.ts.map