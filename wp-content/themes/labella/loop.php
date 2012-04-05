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

<?php /* Display navigation to next/previous pages when applicable */ ?>
<?php 

  global $prefix;

  if( function_exists('easePagination') )
    easePagination( $wp_query->max_num_pages );

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
<?php endif; ?>

<?php while ( have_posts() ) : the_post(); ?>

<?php /* How to display posts in the Gallery category. */ ?>

		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>		  
			<h2 class="entry-title">
				<a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'boilerplate' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php the_title(); ?></a>
			</h2>

      <?php /* ?>
			<div class="entry-meta">
				<?php boilerplate_posted_on(); ?>
			</div><!-- .entry-meta -->
      <?php */ ?>
      
		  <?php
		    if ( has_post_thumbnail() ) {
		     
		      echo '<div class="pic">';
		      
		      the_post_thumbnail('loop-thumb');
		      
		      echo '</div>';
		    }
		  ?>


	<?php if ( is_archive() || is_search() ) : // Only display excerpts for archives and search. ?>
			<div class="entry-summary">
				<?php the_excerpt(); ?>
				<div class="clearfix"></div>
			</div><!-- .entry-summary -->
	<?php else : ?>
			<div class="entry-content">
				<?php global $more; $more = 0; the_content( __( 'Read More', 'boilerplate' ) ); ?>
				<?php wp_link_pages( array( 'before' => '<div class="page-link">' . __( 'Pages:', 'boilerplate' ), 'after' => '</div>' ) ); ?>
				<div class="clearfix"></div>
			</div><!-- .entry-content -->
	<?php endif; ?>

			<div class="clearfix"></div>
		</article><!-- #post-## -->



<?php endwhile; // End the loop. Whew. ?>

<?php /* Display navigation to next/previous pages when applicable */ ?>
<?php 
  //if ( $wp_query->max_num_pages > 1 )
  if( function_exists('easePagination') )
    easePagination( $wp_query->max_num_pages );

?>
