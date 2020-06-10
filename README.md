# epic-crawler

A simple crawler for retriving important data from web pages.

#### Installation

`$ npm i epic-crawler --save`

## Usage

```
const crawler = new epicCrawler("https://google.com", {
    depth: 1
});

crawler.crawl().then((data) => {
    console.log(data);
});

crawler.clearCache(); //Optional method to clear crawler cache.

```

## Options

- _depth_ - 1 to 5 (Default 1) | Crawling Depth.
- _strict_ - _boolean_ (Default True) | Set to False if you also want to collect links related to other websites.
