export const acl = (active: boolean, className: string = 'active', or: string = '') => {
  return active ? className : or
}
