<?php
// Render the block for front end
$block_attributes = get_block_wrapper_attributes();
?>
<div <?php echo $block_attributes; ?>><?php print $content; ?></div>