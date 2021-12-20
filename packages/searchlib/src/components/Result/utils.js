export const firstWords = (text, wordsNumber) => {
  const suffix = ' ...';
  const words = text.split(' ');
  if (words.length > wordsNumber) {
    return words.slice(0, wordsNumber).join(' ') + suffix;
  } else {
    return text;
  }
};
