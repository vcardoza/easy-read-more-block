import { useBlockProps } from "@wordpress/block-editor";

const save = (props) => {
	// Destructure props
	const {
		readMoreText,
		linkClassName,
		selectedLinkTarget,
		selectedPostTitle,
		selectedPostPermalink,
	} = props.attributes;
	return (
		<p {...useBlockProps.save({ className: linkClassName })}>
			{readMoreText}:&nbsp;
			<a target={selectedLinkTarget} href={selectedPostPermalink}>
				{selectedPostTitle}
			</a>
		</p>
	);
};

export default save;
