import * as React from "react";

import poolHeader from "../images/swimImage.jpg";
import tennisHeader from "../images/tennisHeader.jpg";
import poolBody from "../images/bodyImage.jpg";
import tennisBody from "../images/tennisBody.jpg";
import useCloudContent from "../hooks/useCloudContent";

interface InfoProps {
	alignment: string;
	title: string;
}

export default function Info({ alignment, title }: InfoProps) {
	const getContent = useCloudContent(title);

	const getHeader = (): JSX.Element => {
		return (
			<>
				<div className="header-text">
					<h1>{title.toUpperCase()}</h1>
					{title === "swim" ? (
						<p className="content-wrapper">
							Our pool is at the heart of the bluffs experience. Kids and adults
							of all ages love the amazing lifeguard staff and amenities that
							the pool provides.
						</p>
					) : (
						<p className="content-wrapper">
							Each Bedford Bluffs membership comes with a comprehensive tennis
							program. Our four clay courts are regularly maintained, have
							lights and are available for use throughout the season. Free
							lessons by a certified tennis pro are also included for all
							members (adults and children ages 5 and above).
						</p>
					)}
				</div>
				<img src={title === "swim" ? poolHeader : tennisHeader} />
			</>
		);
	};

	const getBody = (): JSX.Element => {
		return (
			<div className="body-wrapper">
				<div className="text-wrapper content-wrapper cloud-content">
					<>{getContent()}</>
				</div>
				<img
					src={title === "swim" ? poolBody : tennisBody}
					alt="Ripped man walks next to pool"
					className="body-image"
				/>
			</div>
		);
	};

	return (
		<div id={`info-wrapper-${alignment}`}>
			<div className="info-header">{getHeader()}</div>
			{getBody()}
		</div>
	);
}
