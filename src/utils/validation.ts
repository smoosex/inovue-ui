// 手机号验证（中国）
export const validateMobile = (value: string): boolean => {
  if (!value) return false;
  return /^1[3-9]\d{9}$/.test(value);
};

// 座机号码验证
export const validatePhone = (value: string): boolean => {
  if (!value) return false;
  return /^(\d{3,4}-?)?\d{7,8}$/.test(value);
};

// 邮箱验证
export const validateEmail = (value: string): boolean => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
