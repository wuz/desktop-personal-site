const fs = require("fs");
const path = require("path");
const sass = require("sass");
const csso = require('csso');

const fileName = "main.scss";

module.exports = class {
  async data() {
    const rawFilepath = path.join(__dirname, `../_includes/styles/${fileName}`);
    return {
      permalink: `css/main.css`,
      rawFilepath,
      rawCss: await fs.readFileSync(rawFilepath),
    };
  }

  async render({ rawCss, rawFilepath }) {
    const { css } = sass.renderSync({file: rawFilepath });
    const minified = csso.minify(css.toString()).css;
    return minified;
  }
};
