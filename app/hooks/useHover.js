import React from "react"

export default function useHover() {
  const [value, setValue] = React.useState()
  const ref = React.useRef(null)

  const onMouseOver = () => setValue(true)
  const onMouseOut = () => setValue(false)


  React.useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener("mouseover", onMouseOver)
      node.addEventListener("mouseout", onMouseOut)

      return () => {
        node.removeEventListener("mouseover", onMouseOver)
        node.removeEventListener("mouseout", onMouseOut)
      }
    }
  }, [ref.current])

  return [value, ref]
}
