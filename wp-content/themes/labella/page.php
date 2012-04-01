<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the wordpress construct of pages
 * and that other 'pages' on your wordpress site will use a
 * different template.
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */

get_header(); 

//was a banner printed?  
global $banner;
global $prefix;
?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); 
        $show_gallery = get_post_meta( $post->ID, $prefix.'show_gallery', true );
        $show_loop = get_post_meta( $post->ID, $prefix.'show_loop', true );
                
        if( $show_loop == 'none' )
          $show_loop = false;
        
        $col_class = ( $show_gallery || $show_loop ? 'third' : 'half' );
?>
	
	<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		
    <div class="<?php echo $col_class; ?> first">
      <div class="in">
        	  
    	  <?php if ( !$banner ) { ?>	  
    		<header class="parent-title">
    				<h1 class="entry-title"><?php the_title(); ?></h1>
    		</header>
    		<?php } ?>

        <div class="entry-content">
          <?php
          
            if( $subtitle = get_post_meta( $post->ID, $prefix.'page_subtitle', true ) )
              echo '<h2 class="subtitle">'.$subtitle.'</h2>';

            the_content();

          ?>

          <div class="clearfix"></div>
        </div>

        <?php
          if( $call_button = get_post_meta( $post->ID, $prefix.'call_button', true ) ){

            echo make_call_header( get_post_meta( $post->ID, $prefix.'call_header', true ) );

            echo make_call_button( get_post_meta( $post->ID, $prefix.'call_button_text', true ) );
          }
        ?>

      </div>
    </div>

    <div class="<?php echo $col_class; ?> last">
      <div class="in">

          <?php
            // 0 is the option for none
            if ( $show_loop ){
              
              echo show_post_loop( $show_loop );
              
            } else if( $show_gallery ){

              echo make_post_gallery();

            } else {
                            
              echo make_list_header( get_post_meta( $post->ID, $prefix.'list_header', true ) );
              echo make_list_body( get_post_meta( $post->ID, $prefix.'list_elements', true ) );

            }
          ?>


      </div>
    </div>
	</article><!-- #post-## -->
<?php endwhile; endif; ?>
<?php //get_sidebar(); ?>
<div class="clearfix"></div>
<?php get_footer(); ?>