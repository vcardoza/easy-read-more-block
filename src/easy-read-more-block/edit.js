import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, SelectControl, TextControl } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import Pagination from "./components/pagination";
import Loading from "./components/loading";
import "./editor.scss";

const edit = (props) => {
	// State for pagination
	const [paginationItemsStart, setPaginationItemsStart] = useState(1);
	const [paginationItemsEnd, setPaginationItemsEnd] = useState(30);
	const [totalPages, setTotalPages] = useState(1);
	const [allPostsLength, setAllPostsLength] = useState(0);

	// Destructure props
	const { attributes, setAttributes, textdomain } = props;

	// Destructure attributes from props which are stored in block.json
	const {
		selectedPostType,
		currentPage,
		readMoreText,
		selectedLinkTarget,
		searchPostText,
		selectedPostID,
		selectedPostPermalink,
		selectedPostTitle,
		linkClassName,
		paginationStyles,
	} = attributes;

	// Get the block props
	// Add the custom class name to the block props
	// The class name is stored in block.json for global reference
	const blockProps = useBlockProps({
		className: linkClassName,
	});

	// React hook options to get post types
	// Filter the data to only show post types that are visible in the admin menu

	const postTypes = useSelect((select) => {
		const data = select("core").getEntityRecords("root", "postType", {
			per_page: -1,
		});
		return data?.filter((item) => {
			return item.visibility.show_in_nav_menus && item.visibility.show_ui;
		});
	}, []);

	// useSelect common options to get posts
	const postOptions = {
		per_page: 30,
		page: currentPage,
		search: searchPostText,
		status: "publish",
		orderby: "date",
		order: "desc",
	};

	// If integer entered then overwrite the postOptions to search posts by ID
	if (searchPostText > 0) {
		postOptions.search = "";
		postOptions.include = [searchPostText];
	}

	// Retrieves the total number of posts for pagination calculation
	useSelect(
		(select) => {
			setAllPostsLength(0);
			const getAllPosts = select("core").getEntityRecords(
				"postType",
				selectedPostType,
				{ ...postOptions, per_page: -1, _fields: "id" },
			)?.length;

			setAllPostsLength(getAllPosts);
		},
		[postTypes, selectedPostType, searchPostText],
	);

	// Get all the posts
	// This will be triggered when the user enters the search text
	// Also, this will be triggered when the current page is changed by clicking the next and previous buttons
	const posts = useSelect(
		(select) => {
			const data = select("core").getEntityRecords(
				"postType",
				selectedPostType,
				postOptions,
			);

			return data;
		},
		[postTypes, selectedPostType, searchPostText, currentPage],
	);

	// Hook to store the post title and permalink which can be stored on the block
	// The title and permalink is stored in block.json for global reference
	useEffect(() => {
		if (selectedPostID) {
			const post = posts.filter((post) => {
				return post.id == selectedPostID;
			});
			setAttributes({
				selectedPostTitle: post[0]?.title.rendered,
				selectedPostPermalink: post[0]?.link,
			});
		}
	}, [selectedPostID]);

	// Once all the posts are loaded and the state changes this hook with trigger to calculate the pagination
	// Also, when the user clicks the next and previous buttons of the pagination this hook is triggered
	useEffect(() => {
		const totalPages =
			allPostsLength > 30 ? Math.ceil(parseInt(allPostsLength) / 30) : 1;
		setTotalPages(totalPages);

		setPaginationItemsStart(allPostsLength > 30 ? currentPage * 30 - 29 : 1);
		setPaginationItemsEnd(
			allPostsLength > 30
				? currentPage >= totalPages
					? allPostsLength
					: currentPage * 30
				: allPostsLength,
		);
	}, [currentPage, allPostsLength]);

	// Reset the current page to 1 when the search text is changed
	// Also, reset the current page to 1 when the post type is changed
	useEffect(() => {
		setAttributes({ currentPage: 1 });
	}, [selectedPostType, searchPostText]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Settings", textdomain)}>
					<SelectControl
						label={__("Select post type")}
						value={selectedPostType}
						options={[
							...(postTypes || []).map((postType) => ({
								label: postType.labels.name,
								value: postType.slug,
							})),
						]}
						onChange={(changedValue) => {
							setAttributes({
								selectedPostType: changedValue,
								currentPage: 1,
							});
						}}
					/>
					<TextControl
						label={`${__("Search from ", textdomain)} ${selectedPostType}`}
						value={searchPostText}
						onChange={(changedValue) => {
							setAttributes({
								searchPostText: changedValue,
							});
						}}
					/>
					{allPostsLength == undefined ? (
						<Loading />
					) : (
						<>
							{allPostsLength > 0 ? (
								<SelectControl
									label={`${__("Select a ", textdomain)} ${selectedPostType} 
								${
									allPostsLength > 0
										? `(${paginationItemsStart}-${paginationItemsEnd} / ${
												allPostsLength || 0
										  })`
										: ""
								}`}
									value={selectedPostID}
									options={[
										{ label: "None", value: "" },
										...(posts || []).map((post) => ({
											label: post.title.rendered,
											value: post.id,
										})),
									]}
									onChange={(changedValue) => {
										setAttributes({
											selectedPostID: changedValue,
										});
									}}
								/>
							) : (
								<div
									style={{ textAlign: "center", color: "red", padding: "10px" }}
								>
									<p>No {selectedPostType} found!</p>
								</div>
							)}
							{allPostsLength > 30 && (
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									setAttributes={setAttributes}
									paginationStyles={paginationStyles}
									textdomain={textdomain}
								/>
							)}
							<TextControl
								label={__("Read more text", textdomain)}
								value={attributes.readMoreText}
								onChange={(changedValue) => {
									setAttributes({
										readMoreText: changedValue,
									});
								}}
							/>
							<SelectControl
								label={__("Open link in", textdomain)}
								value={selectedLinkTarget}
								options={[
									{
										label: "Same window",
										value: "_self",
									},
									{
										label: "New window",
										value: "_blank",
									},
								]}
								onChange={(changedValue) => {
									setAttributes({ selectedLinkTarget: changedValue });
								}}
							/>
						</>
					)}
				</PanelBody>
			</InspectorControls>
			<p {...blockProps}>
				{__(readMoreText, textdomain)}:&nbsp;
				<a target={selectedLinkTarget} href={selectedPostPermalink}>
					{selectedPostTitle}
				</a>
			</p>
		</>
	);
};

export default edit;
