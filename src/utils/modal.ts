/*
 * @LastEditors: lvxianwen
 * @LastEditTime: 2023-05-26 16:25:06
 */
type getContainerFunc = () => HTMLElement;

//处理 getContainer
export function handleContainer(container?: string | HTMLElement | getContainerFunc, type?: string) {
  if (!container) return type ? document.createDocumentFragment() : document.body;
  // string
  if (typeof container === "string" && document.querySelector && document.querySelector(container)) {
    return document.querySelector(container);
  }
  if ((container as HTMLElement) || (container as getContainerFunc)) {
    return container;
  }
}
