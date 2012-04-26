<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */
?><!DOCTYPE html>
<!--[if lt IE 7 ]><html <?php language_attributes(); ?> class="no-js ie ie6 lte7 lte8 lte9"><![endif]-->
<!--[if IE 7 ]><html <?php language_attributes(); ?> class="no-js ie ie7 lte7 lte8 lte9"><![endif]-->
<!--[if IE 8 ]><html <?php language_attributes(); ?> class="no-js ie ie8 lte8 lte9"><![endif]-->
<!--[if IE 9 ]><html <?php language_attributes(); ?> class="no-js ie ie9 lte9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html <?php language_attributes(); ?> class="no-js notie"><!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<title><?php
			/*
			 * Print the <title> tag based on what is being viewed.
			 * We filter the output of wp_title() a bit -- see
			 * boilerplate_filter_wp_title() in functions.php.
			 */
			wp_title( '|', true, 'right' );
		?></title>
    <link href='http://fonts.googleapis.com/css?family=Prata|Open+Sans:400italic,600italic,700italic,400,600,700' rel='stylesheet' type='text/css'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" /> 
		<link rel="profile" href="http://gmpg.org/xfn/11" />
		<link rel="stylesheet" href="<?php bloginfo( 'template_directory' ); ?>/css/application.css" />
		<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

		<script type="text/javascript">
			Ease = new Object();
			Ease.Url = '<?php bloginfo( 'url' ); ?>';
			Ease.TemplateUrl = '<?php bloginfo('template_directory'); ?>';
			Ease.isFrontPage = <?php if(is_front_page()) { echo 'true'; }else{ echo 'false'; } ?>;
			Ease.wpVersion = '<?php echo trim(get_bloginfo("version")); ?>';
			Ease.postID = '<?php echo get_the_ID(); ?>';
		</script>
		<script src="<?php bloginfo('template_directory'); ?>/js/modernizr.js"></script>
  	<script type="text/javascript">
    	var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
      _gaq.push(['_trackPageview']);
  		
  		Modernizr.load([
  			{ load : ['//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'] },
  			{ test : window.JSON, nope: Ease.TemplateUrl+'/js/json2.js' },
  			/* plugins.js & common.js for development */
  			{ load : Ease.TemplateUrl+'/js/plugins.js' },
  			{ load : Ease.TemplateUrl+'/js/common.js' },
  			/* concatenate and optimize seperate script files for deployment using google closure compiler (compiler.jar) in js folder */
  			//{ load : Ease.TemplateUrl+'/js/theme.js' },
  			{ load : ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js' }
  		]);
  	</script>
<?php
		/* We add some JavaScript to pages with the comment form
		 * to support sites with threaded comments (when in use).
		 */
		if ( is_singular() && get_option( 'thread_comments' ) )
			wp_enqueue_script( 'comment-reply' );

		/* Always have wp_head() just before the closing </head>
		 * tag of your theme, or you will break many plugins, which
		 * generally use this hook to add elements to <head> such
		 * as styles, scripts, and meta tags.
		 */
		wp_head();		
?>
	</head>
	<body <?php body_class(); ?>>

  	<header id="header" role="banner">
      <div class="wrap clearfix">
        
        <div class="mask"></div>
        
        <div class="call">
          <span>Call us:</span>
          <?php echo make_call_button(); ?>
          <?php /* ?>
          <a href="tel:(123) 456-7890">
            (123) 456-7890
          </a>
          <?php */ ?>
        </div>
        
  			<?php if (is_front_page()) { echo '<h1>'; } else { echo '<h2>'; } ?>
  			<a id="logo" href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
  			  <span class="title"><?php bloginfo( 'name' ); ?></span>
    			<span class="description">
    			  <span class="text">
    			    <span class="dot left">&middot;</span>
    			    <?php bloginfo('description'); ?>
    			    <span class="dot right">&middot;</span>
    			  </span>
    			  <span class="bord"></span>
    			</span>  			
  			</a>
  			<?php if (is_front_page()) { echo '</h1>'; } else { echo '</h2>'; } ?>

        <?php get_template_part('nav','primary'); ?>

      </div>
  	</header>
 	
  	<?php
  	  	
  	  if ( is_front_page() )
  	    echo make_banner_images('fp-rotate');
  	  else if( 'page' == get_post_type() )
  	    echo make_banner_images();
  	
  	?>
  	
		<section id="content" role="main">
      <div class="wrap outer">
        <div class="mask"></div>
        <div class="inner">