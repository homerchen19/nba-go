const convertToCm = length => {
  if (length !== '') {
    const [foot, inches] = length.split('-');

    return (foot * 30.48 + inches * 2.54).toFixed(2);
  }

  return '';
};

const convertToKg = weight =>
  weight !== '' ? (weight * 0.45359237).toFixed(2) : '';

export { convertToCm, convertToKg };
