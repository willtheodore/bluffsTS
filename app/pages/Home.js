import React from "react"
import carousel from "../images/carousel1.jpg"

import HorizonalBreakSm from "../vectors/HorizontalBreakSm"

// Main home page for the site
export default function Home() {
  return (
    <React.Fragment>
      <div className="carousel">
        <img
          src={carousel}
          alt="Image Carousel" />
      </div>
      <div
        className="content-wrapper"
        id="home-wrapper" >
        <h2>The Best Way to Spend Your Family's Summer.</h2>
        <HorizonalBreakSm />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ante vel ligula fermentum pretium.
          Nullam consectetur, leo a maximus imperdiet, urna nisl pulvinar magna, quis bibendum mauris orci at enim. Ut vel justo nisi.
          Donec tincidunt vulputate lorem, at elementum tortor feugiat ac. Proin faucibus condimentum tempor.
        </p>
        <p>
          Praesent urna ex, bibendum eget scelerisque at, porta at augue.
          Donec urna eros, suscipit et sapien vitae, posuere condimentum lorem.
          Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Proin venenatis, magna eget feugiat pretium, quam ex suscipit diam, ac hendrerit lectus ante id nulla.
          Sed facilisis aliquam massa, ac molestie mauris. In cursus orci et varius dapibus.
          Integer malesuada dapibus dolor eu laoreet. Suspendisse eget mauris lectus.
          Duis vitae sapien sed neque congue facilisis eget a sem. Sed tristique arcu leo.
          Etiam nec pretium nunc, at ultricies mi. Donec lorem leo, dictum elementum interdum auctor, tempus sit amet mi.
          Pellentesque aliquet nulla ac odio fringilla, sed sollicitudin neque tincidunt.
        </p>
      </div>
    </React.Fragment>
  )
}
