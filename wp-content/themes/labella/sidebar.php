<?php
/**
 * The Sidebar containing the primary and secondary widget areas.
 *
 * @package WordPress
 * @subpackage Boilerplate
 * @since Boilerplate 1.0
 */
?>

<aside id="sidebar">
  <ul class="sideInner">
    <?php if ( !dynamic_sidebar('primary-widget-area') ) : ?>
    <?php endif; ?>
  </ul>
</aside>