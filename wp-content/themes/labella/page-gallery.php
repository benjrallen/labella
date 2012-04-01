<?php
/**
 * Template Name: Page - Gallery
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */

get_header(); ?>
<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>
	
	<article id="galleryPage" <?php post_class(); ?>>
	  
		<?php
			if( has_post_thumbnail() ){														
				$thumbID = get_post_thumbnail_id($post->ID);
				$thumbTitle = get_the_title( $thumbID );
				$thumbSrc = wp_get_attachment_image_src( $thumbID, 'banner' );
				$banner = array(
					'url' => $thumbSrc[0],
					'width' => $thumbSrc[1],
					'height' => $thumbSrc[2]
					
				);
									
				echo '<div class="pageImg">'.
		          '<div class="slides">'.
	              '<div class="slide">'.
					        '<img src="'.$banner['url'].'" width="'.$banner['width'].'" height="'.$banner['height'].'" />'.
				        '</div>'.
				      '</div>'.
				     '</div>';
			}
		?>
	  
		<header class="parent-title">
				<h1 class="entry-title"><?php the_title(); ?></h1>
		</header>
		<div class="entry-content">
			
			<div class="entry-teaser">
				<?php 
					the_content('');
				?>
			</div>
			
			<div class="clearfix"></div>
		</div><!-- .entry-content -->
	</article><!-- #post-## -->
<?php endwhile; ?>
<?php //get_sidebar(); ?>
<div class="clearfix"</div>
<?php get_footer(); ?>