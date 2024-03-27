import { JSDOM } from 'jsdom';

function extractTextFromHTML(htmlString) {
  const dom = new JSDOM(htmlString);
  return dom.window.document.body.textContent || '';
}

export { extractTextFromHTML };
