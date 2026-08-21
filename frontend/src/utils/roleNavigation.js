export function getDashboardPath(user) {
  return user?.role?.trim().toLowerCase() === 'admin' ? '/admin' : '/spacer';
}
