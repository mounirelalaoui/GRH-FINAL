export const storage = {
  get:    (key,fallback=null) => { try{const i=localStorage.getItem(key);return i?JSON.parse(i):fallback}catch{return fallback} },
  set:    (key,value) => { try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false} },
  remove: (key) => { try{localStorage.removeItem(key);return true}catch{return false} },
  clear:  () => { try{localStorage.clear();return true}catch{return false} },
  KEYS:   { TOKEN:'token', USER:'user', THEME:'theme' },
}
