<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the id=main div and all content
 * after.  Calls sidebar-footer.php for bottom widgets.
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */
?>
            </div><!-- .inner -->
          </div><!-- .wrap.outer -->
    		</section><!-- #main -->

		<footer id="footer" role="contentinfo">
				<div class="wrap">
          <div class="foot-left">
  					<?php
  						$fDate = '2012';
  						if ( date('Y') != '2011' ) $fDate = $fDate.' - '.date('Y');
  					?>
  					<span class="foot-copy">&copy;<?php echo $fDate; ?> - <strong>La Bella Homes, Inc</strong>.&nbsp;&nbsp;All rights reserved.</span>
          </div>
          
          <div class="foot-right">
            <span>Site by <a href="http://benjrallen.com" title="benjamin allen">benjrallen</a>.</span>
          </div>

          <div class="clearfix"></div>
				</div>
		</footer><!-- footer -->


<?php
	/* Always have wp_footer() just before the closing </body>
	 * tag of your theme, or you will break many plugins, which
	 * generally use this hook to reference JavaScript files.
	 */
	wp_footer();
?>
	</body>
</html>