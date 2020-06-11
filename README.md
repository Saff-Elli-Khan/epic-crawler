# Epic Crawler

A simple crawler for scraping important data from web pages.

#### Installation

`$ npm i epic-crawler --save`

## Usage

```
const crawler = new epicCrawler("https://google.com", {
    depth: 5,
});

crawler.init().then(() => {
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

- **_init: () => Promise<unknown>_** - Initialize crawler.
- **_clearCache: () => this_** - Clear previous crawled cache.
- **_crawl: () => Promise<unknown>_** - Start Crawling.
