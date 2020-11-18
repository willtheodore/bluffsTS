import * as React from "react";
import { useContext } from "react";
import AuthContext from "../contexts/auth";
import { BluffsUser } from "../utils/users";

export default function CheatSheet() {
	const user: BluffsUser = useContext(AuthContext);

	const getDenied = () => (
		<div className="content-wrapper cloud-content" id="cheat-sheet">
			<p>You must be signed in as an admin to view this page.</p>
		</div>
	);

	if (!user || !user.isAdmin) {
		return getDenied();
	}

	return (
		<div id="cheat-sheet" className="content-wrapper cloud-content">
			<h1>Tutorial on editing content</h1>
			<hr />
			<p>
				Hey! In order to use some of the really great content editing features
				in this site, you should be somewhat familiar with something called
				HTML. I swear it's way easier than it sounds. For the most part, when
				you're editing content for any of the pages you can just type normally
				and it will show up correctly on the webpage once you hit submit. But if
				you want to add super cool features like <strong>bold</strong> and{" "}
				<em>itallics</em>, you'll have to use very basic HTML. In order to
				change the way some text looks, you have to use something called a{" "}
				<strong>tag</strong>. A tag looks like this:
				{" <TAGNAME>content</TAGNAME>"}. Just replace TAGNAME with the name of
				the tag you would like to use. For example, to make your text bold, wrap
				your text in a {"<strong>"} tag, like this:
				{" <strong>some text</strong>"}. To add itallics, do the same thing, but
				use the "em" (short for emphasis) tag. There are also tags for six
				different kinds of headers. See what they look like below!
			</p>
			<hr />
			<h1>This is what an h1 tag looks like</h1>
			<h2>This is what an h2 tag looks like</h2>
			<h3>This is what an h3 tag looks like</h3>
			<h4>This is what an h4 tag looks like</h4>
			<h5>This is what an h5 tag looks like</h5>
			<h6>This is what an h6 tag looks like</h6>
			<blockquote>
				This is a {"<blockquote>"} tag. Block quotes can span multiple lines and
				indicate a quote. Here is some dummy text to illustrate this. Lorem
				ipsum dolor sit, amet consectetur adipisicing elit. Nobis, corporis
				corrupti! Culpa soluta non delectus enim assumenda consectetur quas vero
				nam at molestiae. Velit eaque itaque obcaecati officiis nobis magnam.
				Eaque dolorem eligendi numquam sapiente tempora deleniti, ab beatae
				nobis excepturi ad tenetur, veniam optio odit! Pariatur consequatur quod
				dolore!
			</blockquote>
			<p>Typing normal text will look like this.</p>
			<p>
				If you type a url like this: "www.google.com", it ill be converted to a
				clickable link like this: "<a href="//www.google.com">www.google.com</a>
				". No tag is required here! Any links that are typed out will be
				automatically converted.
			</p>
			<p>Also, to do these nifty horizontal lines, just type {"<hr />"}.</p>
			<hr />
			<p>
				Congratulations! You should now be able to write some great looking
				content on this site. If you have any questions, text me at (603)
				213-1011. Good luck!
			</p>
		</div>
	);
}
