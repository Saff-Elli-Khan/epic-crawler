# Epic Crawler

A simple crawler for scraping important data from web pages.

#### Installation

`$ npm i epic-crawler --save`

## Usage

```
const crawler = new epicCrawler;
crawler.init("https://google.com", {
    depth: 5,
}).then(() => {
    crawler.crawl().then((data) => {
        console.log(data);
    });
}).catch((data) => {
    console.log(data);
});

```

## Options

Just three options are supported for now.

- _depth_ - 1 to 5 (Default 1) | Crawling Depth.
- _strict_ - _boolean_ (Default True) | Set to False if you also want to collect links related to other websites.
- _cache_ - _boolean_ (Default True) | Speeds up the crawl by saving data in the cache.

## Methods

- **_init: (url: string, { depth, strict, cache }?: options) => Promise<unknown>_** - Initialize crawler.
- **_blackList: (fingerPrintList: (string | RegExp)[]) => this_** - Black List Links.
- **_clearCache: () => this_** - Clear previous crawled cache.
- **_crawl: () => Promise<unknown>_** - Start Crawling.
