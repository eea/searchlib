export const firstWords = (text, wordsNumber) => {
  const suffix = ' ...';
  const words = text.split(' ');
  if (words.length > wordsNumber) {
    return words.slice(0, wordsNumber).join(' ') + suffix;
  } else {
    return text;
  }
};

export const firstChars = (text, charsNumber) => {
  const suffix = ' ...';
  if (text.length > charsNumber) {
    return text.substring(0, charsNumber) + suffix;
  } else {
    return text;
  }
};
