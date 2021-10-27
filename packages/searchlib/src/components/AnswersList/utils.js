export const highlightUrl = (url, text) => {
  return `${url}#:~:text=${encodeURIComponent(text)}`;
  // TODO: ideally we'd use this library, but it is too much tied up to DOM
  // https://github.com/GoogleChromeLabs/text-fragments-polyfill/blob/main/src/fragment-generation-utils.js
  // const start = text.slice(0, 8);
  // const end = text.slice(text.length - 8, text.length);
  // return `${url}#:~:text=${encodeURIComponent(start)},${encodeURIComponent(
  //   end,
  // )}`;
};
