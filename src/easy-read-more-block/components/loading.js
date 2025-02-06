import { Spinner } from "@wordpress/components";

const Loading = () => {
	return (
		<div style={{ textAlign: "center" }}>
			<p>Loading...</p>
			<Spinner />
		</div>
	);
};

export default Loading;
