<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query. 
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */

get_header(); ?>

			<?php
			/* Run the loop to output the posts.
			 * If you want to overload this in a child theme then include a file
			 * called loop-index.php and that will be used instead.
			 */
			 //get_template_part( 'loop', 'index' );
			?>

<?php /* Sidebar before rotator on owasso */ ?>


<article id="front-page-entry" <?php post_class(); ?>>

  <div class="half first">
    <div class="in">
      <div class="entry-content">
        <?php 
          global $prefix;
      
          if ( have_posts() ) : while( have_posts() ) : the_post();

            if( $subtitle = get_post_meta( $post->ID, $prefix.'page_subtitle', true ) )
              echo '<h2 class="subtitle">'.$subtitle.'</h2>';
      
            the_content();
        
          endwhile; endif;
      
        ?>
     
        <div class="clearfix"></div>
      </div>

      <div class="buttons">
        <?php
          //pages 5 and 6 are the ids for past projects and current developments
          $pages = array( 6, 5 );
      
          foreach( $pages as $id ){
            $title = get_the_title( $id );
            echo '<a class="base_button" href="'.get_permalink( $id ).'" title="'.$title.'">'.$title.'</a>';
          }
    
        ?>
      </div>

    </div>
  </div>
  
  <div class="half last">
    <div class="in">

        <?php
          if( $call_button = get_post_meta( $post->ID, $prefix.'call_button', true ) ){
            
            echo make_call_header( get_post_meta( $post->ID, $prefix.'call_header', true ) );
              
            echo make_call_button( get_post_meta( $post->ID, $prefix.'call_button_text', true ) );
          }

          echo make_list_header( get_post_meta( $post->ID, $prefix.'list_header', true ) );
          echo make_list_body( get_post_meta( $post->ID, $prefix.'list_elements', true ) );

        ?>


    </div>
  </div>
</article>

<?php //get_sidebar(); ?>


<div class="clearfix"></div>

<?php get_footer(); ?>