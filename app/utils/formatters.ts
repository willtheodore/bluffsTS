import { FSComment, Timestamp } from "./blog"

export interface Search {
  [key: string]: string
}

export type Path = string[]

/**
 * Formats a date for use in UI components
 * 
 * @param date {Timstamp} a timestamp in firestore format to be converted to a date string
 * @returns {string} a string representation of the passed timestamp
 */
export function formatDateForDescription(date: Timestamp): string {
  if (date) {
    const jsDate = new Date(date.seconds * 1000)
    const month = jsDate.getMonth() + 1
    const day = jsDate.getDate()
    const year = jsDate.getFullYear().toString().slice(2)
    const [ hours, apm ] = parseHours(jsDate.getHours())
    const minutes = parseMinutes(jsDate.getMinutes())

    return `${month}/${day}/${year} at ${hours}:${minutes} ${apm}`
  } else {
    return "MM/DD/YY at HH:MM AM"
  }
}

/**
 * Adds the formattedDate property to a FSComment object
 * 
 * @param comment {FSComment} a firestore comment object
 * @returns {FSComment} a firestore comment object with the formattedDate property
 */
export function formatComment(comment: FSComment): FSComment {
  const date = comment.datePosted
  const formattedDate = formatDateForDescription(date)
  return {
    formattedDate: formattedDate,
    ...comment
  }
}

/**
 * Parses a location (URL) into an array representing the total path tree
 * 
 * @param location {Location} the location of the current url
 * @returns {Path} an array of strings representing the total path of the location
 */
export function parsePath(location: Location): Path {
  if (location.pathname) {
    const path = location.pathname
    let stringBuild = ""
    let tokens: string[] = []
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
  return []
}

/**
 * Parses the search string of the url into an object where keys are property names and values are values
 * 
 * @param location {Location} location object representing the current URL
 * @returns {Search} an object representing the search string of the url
 */
export function parseSearch(location: Location): Search {
  if (location && location.search) {
    const search = location.search
    let param = ""
    let value = ""
    let result: { [key: string]: boolean | string} = {}

    for (let i = 0; i < search.length; i++) {
      const char = search.charAt(i)
      const paramEmpty = param.length === 0
      const valueEmpty = value.length === 0

      switch (char) {
        case "?":
          if (!paramEmpty || !valueEmpty) {
            console.log("Returning ERROR obj from parseSearch: unexpected token '?'")
            return { error: "ERROR" }
          }
          break;
        case "=":
          if (!paramEmpty && valueEmpty) {
              result[param] = true
          } else {
            console.log("Returning ERROR obj from parseSearch: unexpected token '='")
            return { error: "ERROR" }
          }
          break;
        case "&":
          if (result[param] && !valueEmpty) {
            result[param] = value
            param = ""
            value = ""
          } else {
            console.log("Returning ERROR obj from parseSearch: unexpected token '&'")
            return { error: "Error"}
          }
          break;
        default:
          if (result[param]) {
            value = value.concat(char)
          } else if (valueEmpty) {
            param = param.concat(char)
          } else {
            console.log("Returning ERROR obj from parseSearch: value with no param")
          }
      }
    }
    if (result[param]) {
      result[param] = value
    }
    return result as Search
  }
  return { error: "ERROR" }
}

/**
 * Formats the minutes for use in a UI date display
 * 
 * @param minutes {number} the number of minutes from the JS date object
 * @returns {string} a string representation of the minutes (e.g.: "04" instead of "4")
 */
function parseMinutes(minutes: number): string  {
  if (minutes < 10) { return `0${minutes}` }
  else { return minutes.toString() }
}

/**
 * Formats a 24 hour hours value into 12 hour time. Also returns "AM" or "PM" as appropriate.
 * 
 * @param hours {number} the number of hours from the JS date object
 * @returns {[number, string]} a tuple containing the formatted number of hours and a string of either "AM" or "PM"
 */
function parseHours(hours: number): [number, "AM" | "PM"] {
  if (hours > 12) {
    return [hours - 12, "PM"]
  }
  return [hours, "AM"]
}
