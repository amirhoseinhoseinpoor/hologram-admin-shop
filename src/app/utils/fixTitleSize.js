export const fixTitleSize = ({ text, length }) => {
  var shortTitle;
  if (text.length > length) {
    shortTitle = text.slice(0, length) + "...";
    return shortTitle;
  } else {
    return text;
  }
};
