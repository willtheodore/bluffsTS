import React from "react"
import PropTypes from "prop-types"
import swimImage from "../images/swimImage.jpg"
import bodyImage from "../images/bodyImage.jpg"


export default function Info({ alignment, title }) {
  return (
    <div id={`info-wrapper-${alignment}`}>
      <div className="info-header">
        <div className="header-text">
          <h1>{title.toUpperCase()}</h1>
          <p className="content-wrapper">
            Our olypic sized pool is at the heart of the bluffs experience.
            Kids and adults of all ages love the amazing lifeguard staff and amenities that the pool provides.
          </p>
        </div>
        <img
          src={swimImage}
          alt="A pool glistening" />
      </div>
      <div className="body-wrapper">
        <div className="text-wrapper">
          <div className="content-wrapper">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ante vel ligula fermentum pretium. Nullam consectetur, leo a maximus imperdiet, urna nisl pulvinar magna, quis bibendum mauris orci at enim. Etiam et nulla massa. Duis pellentesque lectus hendrerit felis tincidunt commodo dapibus in sem. Duis faucibus lectus et orci congue, sed porta purus dapibus. In hendrerit nisl sed eros rutrum condimentum. Etiam non porttitor eros. Nam ligula sem, sodales ut dui eu, pellentesque ullamcorper massa. Nulla facilisi. Ut vel justo nisi. Donec tincidunt vulputate lorem, at elementum tortor feugiat ac. Proin faucibus condimentum tempor.
            </p>
            <p>
              Praesent urna ex, bibendum eget scelerisque at, porta at augue. Donec urna eros, suscipit et sapien vitae, posuere condimentum lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin venenatis, magna eget feugiat pretium, quam ex suscipit diam, ac hendrerit lectus ante id nulla. Sed facilisis aliquam massa, ac molestie mauris. In cursus orci et varius dapibus. Integer malesuada dapibus dolor eu laoreet. Suspendisse eget mauris lectus. Duis vitae sapien sed neque congue facilisis eget a sem. Sed tristique arcu leo. Etiam nec pretium nunc, at ultricies mi. Donec lorem leo, dictum elementum interdum auctor, tempus sit amet mi. Pellentesque aliquet nulla ac odio fringilla, sed sollicitudin neque tincidunt.
            </p>
          </div>
        </div>
        <img
          src={bodyImage}
          alt="Ripped man walks next to pool"
          className="body-image" />
      </div>
    </div>
  )
}

Info.propTypes = {
  alignment: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
