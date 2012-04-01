<?php
/**
 * The loop that displays posts.
 *
 * The loop displays the posts and the post content.  See
 * http://codex.wordpress.org/The_Loop to understand it and
 * http://codex.wordpress.org/Template_Tags to understand
 * the tags used in it.
 *
 * This can be overridden in child themes with loop.php or
 * loop-template.php, where 'template' is the loop context
 * requested by a template. For example, loop-index.php would
 * be used if it exists and we ask for the loop with:
 * <code>get_template_part( 'loop', 'index' );</code>
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */
?>


<?php /* If there are no posts to display, such as an empty archive page */ ?>
<?php if ( ! have_posts() ) : ?>
	<article id="post-0" class="post error404 not-found">
		<h1 class="entry-title"><?php _e( 'Not Found', 'boilerplate' ); ?></h1>
		<div class="entry-content">
			<p><?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'boilerplate' ); ?></p>
			<?php get_search_form(); ?>
		</div><!-- .entry-content -->
	</article><!-- #post-0 -->
<?php else: ?>
  
<header class="parent-title loop">
  <h2 class="entry-title">Blog</h2>
</header>

<?php endif; ?>

<?php
	/* Start the Loop.
	 *
	 * In Twenty Ten we use the same loop in multiple contexts.
	 * It is broken into three main parts: when we're displaying
	 * posts that are in the gallery category, when we're displaying
	 * posts in the asides category, and finally all other posts.
	 *
	 * Additionally, we sometimes check for whether we are on an
	 * archive page, a search page, etc., allowing for small differences
	 * in the loop on each template without actually duplicating
	 * the rest of the loop that is shared.
	 *
	 * Without further ado, the loop:
	 */ ?>
<?php while ( have_posts() ) : the_post(); ?>

		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

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
  					        '<a href="'.get_permalink().'" title="'.get_the_title().'">'.
  					          '<img src="'.$banner['url'].'" width="'.$banner['width'].'" height="'.$banner['height'].'" />'.
  					        '</a>'.
  				        '</div>'.
  				      '</div>'.
  				     '</div>';
  			}
  		?>

			<h2 class="entry-title"><a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'boilerplate' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php the_title(); ?></a></h2>

			<div class="entry-content">
				<?php rochelle_posted_on(); ?>
				<?php the_content( __( 'Continue reading <span class="meta-nav">&rarr;</span>', 'boilerplate' ) ); ?>
				<?php wp_link_pages( array( 'before' => '<div class="page-link">' . __( 'Pages:', 'boilerplate' ), 'after' => '</div>' ) ); ?>
				<div class="clearfix"></div>
			</div><!-- .entry-content -->

<?php /* ?>
			<footer class="entry-utility">
				<?php if ( count( get_the_category() ) ) : ?>
					<?php printf( __( 'Posted in %2$s', 'boilerplate' ), 'entry-utility-prep entry-utility-prep-cat-links', get_the_category_list( ', ' ) ); ?>
					|
				<?php endif; ?>
				<?php
					$tags_list = get_the_tag_list( '', ', ' );
					if ( $tags_list ):
				?>
					<?php printf( __( 'Tagged %2$s', 'boilerplate' ), 'entry-utility-prep entry-utility-prep-tag-links', $tags_list ); ?>
					|
				<?php endif; ?>
				<?php comments_popup_link( __( 'Leave a comment', 'boilerplate' ), __( '1 Comment', 'boilerplate' ), __( '% Comments', 'boilerplate' ) ); ?>
				<?php edit_post_link( __( 'Edit', 'boilerplate' ), '| ', '' ); ?>
			</footer><!-- .entry-utility -->
<?php */ ?>
		</article><!-- #post-## -->

		<?php //comments_template( '', true ); ?>


<?php endwhile; // End the loop. Whew. ?>

<?php /* Display navigation to next/previous pages when applicable */ ?>
<?php if ( $wp_query->max_num_pages > 1 ) : ?>
	<nav id="nav-below" class="navigation">
		<div class="older"><?php next_posts_link( __( '<span class="meta-nav">&larr;</span> Older posts', 'boilerplate' ) ); ?></div>
		<div class="newer"><?php previous_posts_link( __( 'Newer posts <span class="meta-nav">&rarr;</span>', 'boilerplate' ) ); ?></div>
		<div class="clearfix"></div>
	</nav><!-- #nav-above -->
<?php endif; ?>
