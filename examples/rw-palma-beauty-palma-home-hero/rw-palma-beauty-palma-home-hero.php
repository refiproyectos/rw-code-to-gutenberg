<?php
/**
 * Plugin Name: RW Palma Beauty Palma Home Hero
 * Description: Gutenberg block for the Palma Home Hero section.
 * Version: 0.1.0
 * Author: Refineria
 * Text Domain: rw-palma-beauty-palma-home-hero
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function rw_palma_beauty_palma_home_hero_load_textdomain() {
	load_plugin_textdomain(
		'rw-palma-beauty-palma-home-hero',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'init', 'rw_palma_beauty_palma_home_hero_load_textdomain' );

function rw_palma_beauty_register_refineria_category( $categories ) {
	foreach ( $categories as $category ) {
		if ( isset( $category['slug'] ) && 'refineria' === $category['slug'] ) {
			return $categories;
		}
	}

	$categories[] = array(
		'slug'  => 'refineria',
		'title' => __( 'Refineria', 'rw-palma-beauty-palma-home-hero' ),
		'icon'  => null,
	);

	return $categories;
}
add_filter( 'block_categories_all', 'rw_palma_beauty_register_refineria_category' );

function rw_palma_beauty_palma_home_hero_enqueue_fonts() {
	wp_enqueue_style(
		'rw-palma-beauty-palma-home-hero-fonts',
		'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap',
		array(),
		null
	);
}
add_action( 'enqueue_block_assets', 'rw_palma_beauty_palma_home_hero_enqueue_fonts' );

function rw_palma_beauty_palma_home_hero_register_block() {
	register_block_type( __DIR__ );
}
add_action( 'init', 'rw_palma_beauty_palma_home_hero_register_block' );
