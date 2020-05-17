"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const epic_link_crawler_1 = require("epic-link-crawler");
class epicCrawler {
    //Construct
    constructor(url, { depth = 1, strict = true } = {}) {
        this.crawledLinks = [];
        this.data = [];
        this.crawl = () => {
            let self = this;
            return new Promise((resolve, reject) => {
                self.elc.crawl().then((links) => {
                    self.crawledLinks = links;
                    let data = [];
                    self.crawledLinks.forEach((v, i) => {
                        self.elc.getContent(v).then((content) => {
                            if (typeof content != "undefined") {
                                let $ = self.elc.$.load(content);
                                //Stuff Here
                            }
                            if (self.crawledLinks.length == (i + 1)) {
                            }
                        }).catch(() => {
                            //Do nothing.
                        });
                    });
                }).catch((error) => {
                    reject(error);
                });
            });
        };
        this.elc = new epic_link_crawler_1.epicLinkCrawler(url, {
            depth: depth,
            strict: strict,
        });
    }
}
exports.epicCrawler = epicCrawler;
//# sourceMappingURL=epicCrawler.js.map