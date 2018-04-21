const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const markdown = require("markdown").markdown;
const cleaner = require('clean-html');
const cleaner_options = {
    'break-around-tags': ['body', 'li', 'blockquote', 'br', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'link', 'meta', 'p', 'table', 'title', 'td', 'tr'],
    'indent': '  '
};
const template_filename = "base_template.html";
const markdown_filename = "bitcoin_talk.md";
const html_file_name = "bitcoin_talk.html";

async function readTemplate(){
    var html_template = await readFile('base_template.html', 'utf-8');
    return html_template
}
async function readMarkdown(){
    var markup_main = await readFile('bitcoin_talk.md', 'utf-8');
    var html_main = markdown.toHTML(markup_main)
    return html_main
}
    /*
*/
Promise.all([readTemplate(), readMarkdown()]).then(function(data){
    let template=data[0];
    let main=data[1];
    let at_string = template.indexOf('<main>') + 6;
    let html_data = [ template.slice(0, at_string), main, template.slice(at_string)].join('');
    cleaner.clean(html_data, function(html){
        fs.writeFile(html_file_name, html, function(err) {
                if(err) {
                            return console.log(err);
                        }
                console.log("The file was saved!");
        }); 
    });
})
