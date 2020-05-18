"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const epic_link_crawler_1 = require("epic-link-crawler");
const tesseract_js_1 = __importDefault(require("tesseract.js"));
var metaType;
(function (metaType) {
    metaType["na"] = "none";
    metaType["og"] = "openGraph";
    metaType["tw"] = "twitter";
    metaType["ip"] = "itemprop";
})(metaType || (metaType = {}));
;
class epicCrawler {
    //Construct
    constructor(url, { depth = 1, strict = true, ocr = false } = {}) {
        this.crawledLinks = [];
        this.errorLinks = [];
        this.ocrEngine = tesseract_js_1.default;
        this.ocr = false;
        this.blobCache = null;
        this.htmlCache = null;
        this.data = [];
        this.getTitle = () => {
            let self = this;
            let $ = self.htmlCache;
            let title = $("title").text();
            if (typeof title == "undefined" || title == "") {
                if ($("h1").length > 0 && $("h1").text() != "") {
                    title = $("h1").text();
                }
                else if ($("h2").length > 0 && $("h2").text() != "") {
                    title = $("h2").text();
                }
                else {
                    title = null;
                }
            }
            return title;
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
        this.ocrImages = () => {
            let self = this;
            let images = self.collectImages();
            let errorLinks = [];
            let data = [];
            return new Promise((resolve, reject) => {
                images.forEach((v, i) => {
                    self.ocrEngine.recognize(v, "eng").then(({ data: { text } }) => {
                        data.push({
                            link: v,
                            text: text,
                        });
                        if (images.length == (data.length + errorLinks.length)) {
                            resolve(data);
                        }
                    }).catch(() => {
                        errorLinks.push(v);
                    });
                });
            });
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
                if ($(this).attr("src") != "")
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
                    alts.push($(this).attr("alt"));
            });
            return Array.from(new Set(alts));
        };
        this.getStrong = () => {
            let self = this;
            let $ = self.htmlCache;
            let strong = [];
            $('strong').each(function () {
                if ($(this).text() != "")
                    strong.push($(this).text());
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
                image: null,
                keywords: null,
                author: null,
                strong: [],
                alt: [],
                ocr: [],
            };
            crawl.url = url;
            crawl.canonical = self.canonical();
            crawl.strong = self.getStrong();
            crawl.alt = self.getAlts();
            crawl.geo = self.getGeo();
            crawl.ocr = [];
            //Get Fixed
            let check = [metaType.na, metaType.og, metaType.tw, metaType.ip];
            check.forEach((v, i) => {
                let title = self.getTitle();
                if (title != null)
                    crawl.title = title;
                let type = self.getMetaTags("type", v);
                if (type != null)
                    crawl.type = type;
                let description = self.getMetaTags("description", v);
                if (description != null)
                    crawl.description = description;
                let image = self.getMetaTags("image", v);
                if (image != null) {
                    self.elc.validUrl(image).then(() => {
                        crawl.image = image;
                    }).catch(() => {
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
            return new Promise((resolve, reject) => {
                if (self.ocr) {
                    self.ocrImages().then((data) => {
                        crawl.ocr = data;
                        resolve(crawl);
                    });
                }
                else {
                    resolve(crawl);
                }
            });
        };
        this.crawl = () => {
            let self = this;
            return new Promise((resolve, reject) => {
                self.elc.crawl().then((links) => {
                    self.crawledLinks = links;
                    let data = [];
                    self.crawledLinks.forEach((v, i) => {
                        self.elc.getContent(v).then((content) => {
                            if (typeof content != "undefined") {
                                self.blobCache = content;
                                self.htmlCache = self.elc.$.load(self.blobCache);
                                self.generateData(v).then((crawl) => {
                                    data.push(crawl);
                                });
                            }
                            if (self.crawledLinks.length == (data.length + self.errorLinks.length)) {
                                resolve(data);
                            }
                        }).catch(() => {
                            self.errorLinks.push(v);
                        });
                    });
                }).catch((error) => {
                    reject(error);
                });
            });
        };
        //Initialize Link Crawler
        this.elc = new epic_link_crawler_1.epicLinkCrawler(url, {
            depth: depth,
            strict: strict,
        });
        //Enable OCR (Optical Character Recognition) For Crawler
        if (ocr) {
            require.resolve("tesseract.js");
            this.ocrEngine = tesseract_js_1.default;
        }
        this.ocr = ocr;
    }
}
exports.epicCrawler = epicCrawler;
new epicCrawler("https://guardwatch.net", {
    ocr: true,
}).crawl()
    .then((data) => {
    console.log(data);
}).catch((error) => {
    console.log(error);
});
//# sourceMappingURL=epicCrawler.js.map