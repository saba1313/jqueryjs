<?php get_header(); ?>

	<div id="content" class="widecolumn">
				
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	
		<div class="post" id="post-<?php the_ID(); ?>">
			<h2><a href="/blog/">Blog</a> &raquo; <?php the_title(); ?></h2>
<small>Posted <?php the_time('F jS, Y') ?></small>
	
			<div class="entrytext">
				<?php the_content('<p class="serif">Read the rest of this entry &raquo;</p>'); ?>
	
				<?php link_pages('<p><strong>Pages:</strong> ', '</p>', 'number'); ?>

<hr/>
	
			</div>
		</div>
		
	<?php comments_template(); ?>
	
	<?php endwhile; else: ?>
	
		<p>Sorry, no posts matched your criteria.</p>
	
<?php endif; ?>
	
	</div>

<?php get_footer(); ?>
