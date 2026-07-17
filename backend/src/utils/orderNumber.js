// Generate unique order number
export const generateOrderNumber = () => {
  const date = new Date();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${timestamp}-${random}`;
};
