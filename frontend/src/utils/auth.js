export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('clf_user')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function setCurrentUser(user) {
  localStorage.setItem('clf_user', JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem('clf_user')
}

export function isAuthenticated() {
  return !!getCurrentUser()
}

export function isAdmin() {
  const u = getCurrentUser()
  return !!u && u.is_admin === true
}
