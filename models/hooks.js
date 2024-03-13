export const handleSaveError = (error, data, next) => {
  error.statusCode = 400;
  next();
}

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
}