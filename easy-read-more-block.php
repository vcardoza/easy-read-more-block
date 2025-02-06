<?php

/**
 * Plugin Name:       Easy Read More Block
 * Description:       Block to search posts and add read more link in the post or pages.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Vinoj Cardoza
 * Author URI:        https://vinojcardoza.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       easy-read-more-block
 */

namespace DMGMedia;

use WP_Query;

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

final class DMGBlockReadMore
{
	/**
	 * Initialize the plugin
	 */
	static function init()
	{
		add_action('init', function () {
			register_block_type(__DIR__ . '/build/easy-read-more-block');
		});
	}
}

// Initializa the Easy Read More Block plugin
DMGBlockReadMore::init();
