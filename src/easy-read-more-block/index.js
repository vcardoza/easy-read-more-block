import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";
import edit from "./edit";
import save from "./save";
import icon from "./assets/icon.svg";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit,
	save,
	icon: <img width={30} height={30} src={icon} />,
});
