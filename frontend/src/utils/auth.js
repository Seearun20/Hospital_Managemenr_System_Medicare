export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      email: decoded.email,
      role: decoded.role || 'user',
      firstName: decoded.firstName || '',
      lastName: decoded.lastName || '',
      fullName: (decoded.firstName || '') + (decoded.lastName ? ' ' + decoded.lastName : '') || 'User'
    };
  } catch (err) {
    return null;
  }
};
