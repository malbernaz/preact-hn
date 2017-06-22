import config from "../config";

export function updateTag(tagName, keyName, keyValue, attrName, attrValue) {
  const node = document.head.querySelector(`${tagName}[${keyName}="${keyValue}"]`);

  if (node && node.getAttribute(attrName) === attrValue) return;

  if (node) {
    node.parentNode.removeChild(node);
  }

  if (typeof attrValue === "string") {
    const nextNode = document.createElement(tagName);

    nextNode.setAttribute(keyName, keyValue);
    nextNode.setAttribute(attrName, attrValue);

    document.head.appendChild(nextNode);
  }
}

export function updateTitle(title) {
  if (new RegExp(title).test(document.title)) return;

  document.title = `${config.head.title} | ${title}`;
}

export function updateMeta(name, content) {
  updateTag("meta", "name", name, "content", content);
}

export function updateCustomMeta(property, content) {
  updateTag("meta", "property", property, "content", content);
}

export function updateLink(rel, href) {
  updateTag("link", "rel", rel, "href", href);
}
