import React from "react"

import Header from "../components/Header"
import aboutImage from "../images/aboutImage.jpg"

export default function About() {
  return (
    <div id="about-wrapper">
      <Header text="about"/>
      <div className="content-wrapper">
        <div className="float-right">
          <img src={aboutImage} alt="People enjoying the bluffs"/>
        </div>
        <p className="first-p">Founded in 1962 by 28 families, the Bluffs has been an integral part of the Bedford community ever since. With over 125 active families, we strive to provide the best swim, tennis, and community for you to meet new people, teach your kids to swim, and enjoy the summer months. </p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ante vel ligula fermentum pretium. Nullam consectetur, leo a maximus imperdiet, urna nisl pulvinar magna, quis bibendum mauris orci at enim. Etiam et nulla massa. Duis pellentesque lectus hendrerit felis tincidunt commodo dapibus in sem. Duis faucibus lectus et orci congue, sed porta purus dapibus. In hendrerit nisl sed eros rutrum condimentum. Etiam non porttitor eros. Nam ligula sem, sodales ut dui eu, pellentesque ullamcorper massa. Nulla facilisi. Ut vel justo nisi. Donec tincidunt vulputate lorem, at elementum tortor feugiat ac. Proin faucibus condimentum tempor.</p>
        <p>Praesent urna ex, bibendum eget scelerisque at, porta at augue. Donec urna eros, suscipit et sapien vitae, posuere condimentum lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin venenatis, magna eget feugiat pretium, quam ex suscipit diam, ac hendrerit lectus ante id nulla. Sed facilisis aliquam massa, ac molestie mauris. In cursus orci et varius dapibus. Integer malesuada dapibus dolor eu laoreet. Suspendisse eget mauris lectus. Duis vitae sapien sed neque congue facilisis eget a sem. Sed tristique arcu leo. Etiam nec pretium nunc, at ultricies mi. Donec lorem leo, dictum elementum interdum auctor, tempus sit amet mi. Pellentesque aliquet nulla ac odio fringilla, sed sollicitudin neque tincidunt.</p>
      </div>
    </div>
  )
}
