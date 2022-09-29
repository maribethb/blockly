const { Extractor } = require('markdown-tables-to-json');
const fs = require('fs');
const gulp = require('gulp');
const header = require('gulp-header');
const replace = require('gulp-replace');

const removeRenames = function() {
    // API Extractor output spuriously renames some functions. Undo that.
    // See https://github.com/microsoft/rushstack/issues/2534
    return gulp.src('temp/blockly.api.json')
        .pipe(replace('_2', ''))
        .pipe(gulp.dest('temp/'));
}

const prependBook = function() {
    return gulp.src('docs/*.md')
        .pipe(header('Project: /blockly/_project.yaml\nBook: /blockly/_book.yaml\n\n'))
        .pipe(gulp.dest('docs/'));
}

const createToc = function(done) {
    const fileContent = fs.readFileSync('docs/blockly.md', 'utf8');
    let content = 'toc:\n';
    const referencePath = '/blockly/reference/js';

    // Generate a section of TOC for each section/heading in the overview file.
    const sections = fileContent.split('##');
    for (section of sections) {
        const table = Extractor.extractObject(section, 'rows', false);
        if (table) {
            // Get the name of the section, i.e. the text immediately after the `##` in the source doc
            const sectionName = section.split('\n')[0].trim();
            content += `- heading: ${sectionName}\n`
            for (row in table) {
                // After going through the Extractor, the markdown is now HTML.
                // Each row in the table is now a link (anchor tag).
                // Get the target of the link, excluding the first `.` since we don't want a relative path.
                const path = /href="\.(.*?)"/.exec(row)[1];
                // Get the name of the link (text in between the <a> and </a>)
                const name = /">(.*?)</.exec(row)[1];
                content += `- title: ${name}\n`;
                content += `  path: ${referencePath}${path}\n`
            }

        }
    }
    fs.writeFileSync('docs/_toc.yaml', content);

    done();
}

const docsPrepare = removeRenames;
const docs = gulp.parallel(prependBook, createToc);

module.exports = {docsPrepare, docs};