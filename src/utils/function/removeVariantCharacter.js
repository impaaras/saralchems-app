// export const extractQuantityPrefix = variant => {
//   // const match = variant.match(/^\d+[a-zA-Z]+/);
//   const match = variant.match(/^[^"\\]+/); // Match everything before " or \

//   return match ? match[0] : '';
// };
// export const extractQuantityPrefix = variant => {
//   if (!variant) return '';
//   if (variant.includes('"')) {
//     const match = variant.match(/^.*?"/);
//     return match ? match[0].trim() : '';
//   }
//   const match = variant.match(/^\d+\s*(kg|gm|ltr)/i);
//   return match ? match[0].trim() : '';
// };
// export const extractQuantityPrefix = variant => {
//   if (!variant) return '';

//   let match;
//   if (variant.includes('"')) {
//     match = variant.match(/^.*?"/);
//   } else {
//     match = variant.match(/^\d+\s*(kg|gm|ltr)/i);
//   }

//   return match ? match[0].trim() : '';
// };

export const extractQuantityPrefix = variant => {
  if (!variant || !variant.includes('AFTER')) return '';

  const prefix = variant.split('AFTER')[0];

  return prefix || '';
};
