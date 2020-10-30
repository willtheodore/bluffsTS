export function formatDateForDescription(date) {
  if (date) {
    const jsDate = new Date(date.seconds * 1000)
    const month = jsDate.getMonth() + 1
    const day = jsDate.getDate()
    const year = jsDate.getYear().toString().slice(1)
    const { hours, apm } = parseHours(jsDate.getHours())
    const minutes = parseMinutes(jsDate.getMinutes())

    return `${month}/${day}/${year} at ${hours}:${minutes} ${apm}`
  } else {
    return "MM/DD/YY at HH:MM AM"
  }
}

export function formatComment(comment) {
  if (comment) {
    const date = comment.datePosted
    const formattedDate = formatDateForDescription(date)
    return {
      formattedDate: formattedDate,
      ...comment
    }
  } else {
    return null
  }
}

export function parsePath(location) {
  if (location) {
    const path = location.pathname
    let stringBuild = ""
    let tokens = []
    for (let i = 0; i < path.length; i++) {
      if (path.charAt(i) == "/") {
        if (stringBuild != "") {
          tokens.push(stringBuild)
        }
        stringBuild = ""
      } else {
        stringBuild = stringBuild.concat(path.charAt(i))
      }
    }
    if (stringBuild != "") {
      tokens.push(stringBuild)
    }
    return tokens
  }
  return null
}

export function parseSearch(location) {
  if (location && location.search) {
    const search = location.search
    let param = ""
    let value = ""
    let result = {}

    for (let i = 0; i < search.length; i++) {
      const char = search.charAt(i)
      const paramEmpty = param.length === 0
      const valueEmpty = value.length === 0

      switch (char) {
        case "?":
          if (!paramEmpty || !valueEmpty) {
            console.log("Returning null from parseSearch: unexpected token '?'")
            return null
          }
          break;
        case "=":
          if (!paramEmpty && valueEmpty) {
              result[param] = true
          } else {
            console.log("Returning null from parseSearch: unexpected token '='")
            return null
          }
          break;
        case "&":
          if (result[param] && !valueEmpty) {
            result[param] = value
            param = ""
            value = ""
          } else {
            console.log("Returning null from parseSearch: unexpected token '&'")
            return null
          }
          break;
        default:
          if (result[param]) {
            value = value.concat(char)
          } else if (valueEmpty) {
            param = param.concat(char)
          } else {
            console.log("Returning null from parseSearch: value with no param")
          }
      }
    }
    if (result[param]) {
      result[param] = value
    }
    return result
  }
  return null
}

function parseMinutes(minutes) {
  if (minutes < 10) { return `0${minutes}` }
  else { return minutes }
}

function parseHours(hours) {
  let result = {
    hours: hours,
    apm: "AM"
  }
  if (hours > 12) {
    result.hours = hours - 12
    result.apm = "PM"
  }
  return result
}
