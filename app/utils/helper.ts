export function setCookie(name: string, value: string, days = 1): void {
   if (document) {
      
      deleteCookie(name)
      let expires = ""
      if (days) {
         const date = new Date()
         date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
         expires = "; expires=" + date.toUTCString()
      }
      
      const encodedValue = window.btoa(value)
      document.cookie = `${name}=${encodeURIComponent(
         encodedValue
      )}${expires}; path=/`
   }
}

export function getCookie<T>(name: string, fallbackValue: T): T {
   if (document) {
      const cookies = document.cookie.split("; ")
      for (const cookie of cookies) {
        const [key, value] = cookie.split("=")
        if (key === name) {
          const decodedValue = window.atob(decodeURIComponent(value))
    
          if (["number", "boolean"].includes(typeof fallbackValue)) {
            const parsedValue: T = JSON.parse(decodedValue)
            return parsedValue
          }
    
          return decodedValue as T
        }
      }
    
      return fallbackValue
   }
   return fallbackValue
}

export function deleteCookie(name: string): void {
   if (document) {  
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
   }
}

export function deleteAllCookies(props?: { exclude: string[] | string }): void {
   if (document) {
      const pairs = document.cookie.split(";")
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("=")
        const key = (pair[0] + "").trim()
    
        if (props) {
          const skipCookies =
            typeof props.exclude === "string" ? [props.exclude] : props.exclude
    
          if (!skipCookies.includes(key)) {
            deleteCookie(key)
          }
        } else {
          deleteCookie(key)
        }
      }
   }
}
