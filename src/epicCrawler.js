"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const epic_link_crawler_1 = require("epic-link-crawler");
const epic_sync_loops_1 = require("epic-sync-loops");
//@ts-ignore
const text_cleaner_1 = __importDefault(require("text-cleaner"));
var metaType;
(function (metaType) {
    metaType["na"] = "none";
    metaType["og"] = "openGraph";
    metaType["tw"] = "twitter";
    metaType["ip"] = "itemprop";
})(metaType = exports.metaType || (exports.metaType = {}));
;
class epicCrawler {
    //Construct
    constructor() {
        //Defaults
        this.url = null;
        this.elc = null;
        this.crawledLinks = [];
        this.errorLinks = [];
        this.blobCache = null;
        this.htmlCache = null;
        this.options = {};
        this.data = [];
        this.contentCache = {};
        this.init = (url, { depth = 1, strict = true, cache = true } = {}) => {
            this.url = url;
            this.options.depth = depth;
            this.options.strict = strict;
            this.options.cache = cache;
            this.elc = new epic_link_crawler_1.epicLinkCrawler;
            return this.elc.init(this.url, {
                depth: this.options.depth,
                strict: this.options.strict,
                cache: this.options.cache,
            });
        };
        this.getTitle = () => {
            let self = this;
            let $ = self.htmlCache;
            let title = $("title").text();
            if (typeof title == "undefined" || title == "") {
                title = null;
            }
            else {
                title = text_cleaner_1.default(title).condense().valueOf();
            }
            return title;
        };
        this.getHeadings = () => {
            let self = this;
            let $ = self.htmlCache;
            let headings = [];
            if ($("h1").length > 0 && $("h1").text() != "")
                $("h1").each(function () {
                    headings.push(text_cleaner_1.default($(this).text()).condense().valueOf());
                });
            if ($("h2").length > 0 && $("h2").text() != "")
                $("h2").each(function () {
                    headings.push(text_cleaner_1.default($(this).text()).condense().valueOf());
                });
            return headings;
        };
        this.canonical = () => {
            let self = this;
            let $ = self.htmlCache;
            let canonical = $('link[rel="canonical"]').attr("href");
            if (typeof canonical == "undefined") {
                return null;
            }
            else {
                return canonical;
            }
        };
        this.getGeo = () => {
            let geo = {
                position: this.getMetaTags("geo.position", metaType.na),
                region: this.getMetaTags("geo.region", metaType.na),
                country: this.getMetaTags("geo.country", metaType.na),
                state: this.getMetaTags("geo.state", metaType.na),
                city: this.getMetaTags("geo.city", metaType.na),
                place: this.getMetaTags("geo.placename", metaType.na),
            };
            return geo;
        };
        this.getMetaTags = (tagname, type) => {
            let self = this;
            let $ = self.htmlCache;
            let selectorType = "";
            if (type == metaType.na) {
                selectorType = 'meta[name="';
            }
            else if (type == metaType.og) {
                selectorType = 'meta[property="og:';
            }
            else if (type == metaType.tw) {
                selectorType = 'meta[name="twitter:';
            }
            else if (type == metaType.ip) {
                selectorType = 'meta[itemprop="';
            }
            let selector = selectorType + tagname + '"]';
            let result = null;
            if ($(selector).length > 0) {
                result = $(selector).attr("content");
                if (typeof result == "undefined")
                    result = null;
            }
            return result;
        };
        this.collectImages = () => {
            let self = this;
            let $ = self.htmlCache;
            let relativeSrc = [];
            let absoluteSrc = [];
            //Collect Relative Source
            $("img[src^='/']").each(function () {
                if ($(this).attr("src") != "" && self.elc)
                    relativeSrc.push(self.elc.urlBase + "/" + ($(this).attr("src")).replace(/^\/+|\/+$/g, ""));
            });
            //Collect Absolute Source
            $("img[src^='http']").each(function () {
                if ($(this).attr("src") != "")
                    absoluteSrc.push($(this).attr("src"));
            });
            //Remove Any Duplicate Source And Return
            return Array.from(new Set(absoluteSrc.concat(relativeSrc)));
        };
        this.getAlts = () => {
            let self = this;
            let $ = self.htmlCache;
            let alts = [];
            $('img[alt]').each(function () {
                if (typeof $(this).attr("alt") != "undefined" && $(this).attr("alt") != "")
                    alts.push(text_cleaner_1.default($(this).attr("alt")).condense().valueOf());
            });
            return Array.from(new Set(alts));
        };
        this.getStrong = () => {
            let self = this;
            let $ = self.htmlCache;
            let strong = [];
            $('strong').each(function () {
                if ($(this).text() != "")
                    strong.push(text_cleaner_1.default($(this).text()).condense().valueOf());
            });
            return Array.from(new Set(strong));
        };
        this.generateData = (url) => {
            let self = this;
            let crawl = {
                url: null,
                canonical: null,
                type: null,
                title: null,
                description: null,
                headings: [],
                image: null,
                images: [],
                keywords: null,
                author: null,
                strong: [],
                alt: [],
                geo: {},
            };
            //Collect & Store
            crawl.url = url;
            crawl.canonical = self.canonical();
            crawl.images = self.collectImages();
            crawl.strong = self.getStrong();
            crawl.alt = self.getAlts();
            crawl.geo = self.getGeo();
            //Get Fixed
            let check = [metaType.na, metaType.og, metaType.tw, metaType.ip];
            check.forEach((v, i) => {
                crawl.title = self.getTitle();
                let type = self.getMetaTags("type", v);
                if (type != null)
                    crawl.type = type;
                let description = self.getMetaTags("description", v);
                if (description != null)
                    crawl.description = description;
                crawl.headings = self.getHeadings();
                let image = self.getMetaTags("image", v);
                if (image != null && self.elc) {
                    self.elc.validUrl(image).then(() => {
                        crawl.image = image;
                    }).catch(() => {
                        if (self.elc)
                            crawl.image = self.elc.urlBase + "/" + image.replace(/^\/+|\/+$/g, "");
                    });
                }
                let keywords = self.getMetaTags("keywords", v);
                if (keywords != null)
                    crawl.keywords = keywords;
                let keyword = self.getMetaTags("keyword", v);
                if (keyword != null)
                    crawl.keywords = keyword;
                let author = self.getMetaTags("author", v);
                if (author != null)
                    crawl.author = author;
            });
            return crawl;
        };
        this.clearCache = () => {
            var _a;
            return (_a = this.elc) === null || _a === void 0 ? void 0 : _a.clearCache();
        };
        this.crawl = () => {
            let self = this;
            return new Promise((resolve, reject) => {
                if (self.elc)
                    self.elc.crawl().then((links) => {
                        self.crawledLinks = links;
                        let data = [];
                        let loop = new epic_sync_loops_1.epicSyncLoops((i) => {
                            var _a;
                            let link = self.crawledLinks[i];
                            if (typeof link != "undefined") {
                                (_a = self.elc) === null || _a === void 0 ? void 0 : _a.getContent(link).then((content) => {
                                    var _a;
                                    self.blobCache = content;
                                    self.htmlCache = (_a = self.elc) === null || _a === void 0 ? void 0 : _a.$.load(self.blobCache);
                                    //Log
                                    console.log("Crawling: " + link);
                                    data.push(self.generateData(link));
                                    loop.next();
                                }).catch((error) => {
                                    console.log("Warning: " + error, link);
                                    self.errorLinks.push(link);
                                    loop.next();
                                });
                            }
                            else {
                                loop.end();
                                resolve(data);
                            }
                        });
                    }).catch((error) => {
                        reject(error);
                    });
                else
                    reject("Crawler is not Initialized Yet!");
            });
        };
        return this;
    }
}
exports.epicCrawler = epicCrawler;
//# sourceMappingURL=epicCrawler.js.map