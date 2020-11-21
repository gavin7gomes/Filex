const calculateSizeF = (stats) => {
  const filesizeBytes = stats.size;
  const units = "BKMGB";
  const index = Math.floor(Math.log10(filesizeBytes) / 3);
  const filesizeHuman = (filesizeBytes / Math.pow(1000, index)).toFixed(1);

  const unit = units[index];

  const filesize = `${filesizeHuman}${unit}`;

  return [filesizeBytes, filesize];
};

module.exports = calculateSizeF;
