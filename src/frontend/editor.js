const content = document.getElementById('content');
const lineNumbers = document.getElementById('line-numbers');
const { ipcRenderer } = require('electron');
const { KEYWORDS, REGISTER_EXPRESSION, TAG_EXPRESSION, CONDITIONALS, VALUE_EXPRESSION, COMMENT_EXPRESSION } = require('../dict');


const createRange = (node, targetPosition) => {
    let range = document.createRange();
    range.selectNode(node);
    //range.setStart(node, 0);

    let pos = 0;
    const stack = [node];
    while (stack.length > 0) {
        const current = stack.pop();

        if (current.nodeType === Node.TEXT_NODE) {
            const len = current.textContent.length;
            if (pos + len >= targetPosition) {
                range.setStart(current, targetPosition - pos);
                return range;
            }
            pos += len;
        } else if (current.childNodes && current.childNodes.length > 0) {
            for (let i = current.childNodes.length - 1; i >= 0; i--) {
                stack.push(current.childNodes[i]);
            }
        }
    }

    // The target position is greater than the
    // length of the contenteditable element.
    //range.setEnd(node, node.childNodes.length);
    range.setStart(node,node.childNodes.length);
    return range;
};


function saveFile()
{
    console.log(content.innerText);
    const text = content.innerText;
    ipcRenderer.invoke('save-file', text);   
}

function saveFileAs()
{
    console.log(content.innerText);
    const text = content.innerText;
    ipcRenderer.invoke('save-file-as', text);   
}

function openFile()
{
    console.log("open");
    const res = ipcRenderer.invoke('load-file').then((content) => {
        if (content !== null) this.content.innerText = content;
    });
}

function runFile()
{
    console.log("Run");
}

function updateHeight()
{
    content.style.height = 'auto';
    content.style.height = content.scrollHeight+'px';
}

function saveCaret() 
{
    const selection = window.getSelection();
    if (selection.rangeCount > 0)
    {
        const range = selection.getRangeAt(0);
        const clonedRange = range.cloneRange();
        clonedRange.selectNodeContents(content);
        const cursorPosition = clonedRange.toString().length;
        return cursorPosition;
    }
}

function loadCaret(targ)
{
    const range = createRange(content, targ);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function updateLineNumbers() 
{
    //read content
    let text = JSON.stringify(content.innerHTML);

    console.log(content.innerHTML);
    //resizes content based on input size
    //updateHeight();

    //set lines
    let lineNumbersHtml = '1<br>';
    let lines = (text.match(new RegExp("<div>","g")) || []).length;
    if (!text.startsWith("<div>")) lines++;
    for (let i = 1; i < lines; i++) 
    {
      lineNumbersHtml += i+1 + '<br>';
    }
    lineNumbers.innerHTML = lineNumbersHtml;
}

function updateHighlight()
{
    const selection = window.getSelection();
    const caret = saveCaret();
    //remove last frames highlighting
    let html = content.innerHTML;
    html = html.replace(/<span id="keyword">(.*?)<\/span>/g, '$1');
    html = html.replace(/<span id="register">(.*?)<\/span>/g, '$1');
    html = html.replace(/<span id="tag">(.*?)<\/span>/g, '$1');
    html = html.replace(/<span id="conditional">(.*?)<\/span>/g, '$1');
    html = html.replace(/<span id="comm">(.*?)<\/span>/g, '$1');
    html = html.replace(/<span id="value">(.*?)<\/span>/g, '$1');





    //apply new highlighting
    html = highlightModuleStandard(KEYWORDS,"keyword",html);
    html = highlightModuleStandard(CONDITIONALS,"conditional",html);
    html = highlightModuleRegex(REGISTER_EXPRESSION,"register",html);
    html = highlightModuleRegex(TAG_EXPRESSION,"tag",html);
    html = highlightModuleRegex(COMMENT_EXPRESSION,"comm",html);
    html = highlightModuleRegex(VALUE_EXPRESSION,"value",html);



    //let reg = new RegExp(REGISTER_EXPRESSION,"gi");
    //html = html.replace(reg,`<span id="register">$&</span>`)
    content.innerHTML = html;
    loadCaret(caret);
}

function highlightModuleStandard(module,type,input)
{
    for (k of module)
    {
        let regex = new RegExp(`\\b(${k})\\b`,"gi");
        input = input.replace(regex,`<span id=${type}>$&</span>`);
    }
    return input;
}

function highlightModuleRegex(module,type,input)
{
    let regex = new RegExp(module,"gi");
    return input.replace(regex,`<span id=${type}>$&</span>`);
}

function update()
{
    updateLineNumbers();
    updateHeight();
    updateHighlight();
}


//wait for input to update line numbers
content.addEventListener('input', update);


update();

module.exports = { openFile , saveFile, runFile, saveFileAs};