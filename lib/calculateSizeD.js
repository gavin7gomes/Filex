const calculateSizeD = (itemFullStaticPath) => {
  const randBytes = Math.floor(Math.random() * 100 + 1);

  const randBytesHuman = `${randBytes}M`;

  return [randBytes, randBytesHuman];
};

module.exports = calculateSizeD;
