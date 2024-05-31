import  renderMathInElement from 'katex/dist/contrib/auto-render';


let renderEl = (el) => {
  renderMathInElement(el, {
    // customised options
    // • auto-render specific keys, e.g.:
    delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
    ],
    // • rendering keys, e.g.:
    throwOnError : false
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderEl(document.body)
});

export {
  renderEl
}