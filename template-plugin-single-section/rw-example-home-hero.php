<?php
/**
 * Plugin Name: RW Example Home Hero
 * Description: Base template for a single RW Gutenberg block plugin.
 * Version: 0.1.0
 * Author: Refineria
 * Text Domain: rw-example-home-hero
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function rw_example_home_hero_load_textdomain() {
	load_plugin_textdomain(
		'rw-example-home-hero',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'init', 'rw_example_home_hero_load_textdomain' );

function rw_register_refineria_category( $categories ) {
	foreach ( $categories as $category ) {
		if ( isset( $category['slug'] ) && 'refineria' === $category['slug'] ) {
			return $categories;
		}
	}

	$categories[] = array(
		'slug'  => 'refineria',
		'title' => __( 'Refineria', 'rw-example-home-hero' ),
		'icon'  => null,
	);

	return $categories;
}
add_filter( 'block_categories_all', 'rw_register_refineria_category' );

function rw_example_home_hero_register_block() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'rw_example_home_hero_register_block' );
