import * as React from "react"
import { ReactElement, Fragment, useState, useEffect } from "react"

import { Link } from "react-router-dom"
import { parsePath } from "../utils/formatters.js"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>
interface SelectorProps {
  color: string;
  selectedColor: string;
  title: string | null;
  fontSize: string | null;
  preSelected: string | null;
  icons: JSX.Element[] | null;
  setState: SetState<string> | null;
  linkDestinations: string[] | null;
  items: string[];
}

export default function Selector({ color = "#FFFFF3",
                                   selectedColor = "#FFCED4",
                                   title = null,
                                   fontSize = "18px",
                                   preSelected = null,
                                   icons = null,
                                   setState = null,
                                   linkDestinations = null,
                                   items }: SelectorProps) {

  const [selected, setSelected] = useState<string | null>(null)
  const path = parsePath(document.location)

  useEffect(() => {
    if (preSelected != null) { setSelected(preSelected) }
    else if (!linkDestinations) { setSelected(items[0]) }
  }, [])

  useEffect(() => {
    if (linkDestinations) {
      const initial = path[path.length - 1]
      let index = 0
      for (let i = 0; i < linkDestinations.length; i++) {
        if (linkDestinations[i] === initial) {
          index = i
          break
        }
      }
      setSelected(items[index])
    }
  }, [linkDestinations])

  useEffect(() => {
    if (setState) {
      if (selected) { setState(selected) }
    }
  }, [selected])

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: color,
      padding: "0 10px",
      alignItems: "center",
      borderRadius: "10px",
    },
    title: {
      fontFamily: "heebo-medium",
      fontSize: "24px",
      margin: "0 10px",
    },
    break: {
      margin: "0 5px",
      border: "0",
      borderRight: "2px solid black",
      width: "1px",
      height: "30px",
    },
    list: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    item: {
      flexGrow: "1",
      textAlign: "center",
      fontSize: fontSize,
      fontFamily: "heebo-light",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px 0",
    },
    active: {
      backgroundColor: selectedColor,
    }
  }

  const getInnerContent = (index: number, item: string): ReactElement => (
    <Fragment>
      {icons != null && (
        <Fragment>
          {icons[index]}
          <div style={{width: "10px", display: "block"}}></div>
        </Fragment>
      )}
      {item}
    </Fragment>
  )

  return (
    <div style={styles.container} className="selector">
      {title &&  (
        <Fragment>
          <h4 style={styles.title}>{title}</h4>
          <hr style={styles.break}/>
        </Fragment>
      )}
      <ul style={styles.list}>
        {items.map((item, index) => {
          let itemStyle = styles.item
          if (item === selected) {
            itemStyle = {
              ...itemStyle,
              ...styles.active
            }
          }

          if (linkDestinations) {
            let destination = "/"
            for (let i = 0; i < path.length - 1; i++) {
              destination = destination.concat(path[i] + "/")
            }
            destination = destination.concat(linkDestinations[index] + "/")

            return (
              <li className="pointer" key={index} style={itemStyle} onClick={() => setSelected(item)}>
                <Link to={destination}>
                {getInnerContent(index, item)}
                </Link>
              </li>
            )
          }

          return (
            <li className="pointer" key={index} style={itemStyle} onClick={() => setSelected(item)}>
              {getInnerContent(index, item)}
            </li>
        )})}
      </ul>
    </div>
  )
}
