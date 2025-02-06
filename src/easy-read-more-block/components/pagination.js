import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";

const Pagination = (props) => {
	const {
		currentPage,
		totalPages,
		setAttributes,
		paginationStyles,
		textdomain,
	} = props;
	return (
		<>
			<div className={paginationStyles}>
				<Button
					{...(currentPage == 1 && { disabled: true })}
					title={__("Previous page", textdomain)}
					onClick={() => {
						setAttributes({
							currentPage: 1,
						});
					}}
				>
					&laquo;
				</Button>
				<Button
					{...(currentPage == 1 && { disabled: true })}
					title={__("Previous page", textdomain)}
					onClick={() => {
						setAttributes({
							currentPage: currentPage > 1 && currentPage - 1,
						});
					}}
				>
					&lsaquo;
				</Button>
				<Button
					{...(currentPage == totalPages && { disabled: true })}
					title={__("Next page", textdomain)}
					onClick={() => {
						setAttributes({
							currentPage: currentPage <= totalPages && currentPage + 1,
						});
					}}
				>
					&rsaquo;
				</Button>
				<Button
					{...(currentPage == totalPages && { disabled: true })}
					title={__("Previous page", textdomain)}
					onClick={() => {
						setAttributes({
							currentPage: totalPages,
						});
					}}
				>
					&raquo;
				</Button>
			</div>
		</>
	);
};
export default Pagination;
