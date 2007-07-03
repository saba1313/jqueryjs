December 2006.

This module was created by Alf Eaton <alf@hubmed.org>.
Development was sponsored by Nature Publishing Group and Jason Bahn.

It uses some code from
* http://drupal.org/project/voting
* http://sandbox.wilstuckey.com/jquery-ratings/js/jquery.rating.js
* http://jquery.com/dev/svn/trunk/plugins/form/form.js

The requirements for this module are
* http://drupal.org/project/votingapi

and optionally
* http://drupal.org/project/views

A default view will be created at rating/nodes.

Usage:
1) Install the module.
2) In admin/settings/content-types configure whether the rating form should be displayed for each content type.
3) In admin/access set which roles should be allowed to rate content.
4) In admin/settings/jrating set whether the rating form should be displayed for teasers, whether it should be displayed for anonymous users, and whether to display the average rating.

If you want the rating form to appear in CCK nodes, print $node->jrating_html in your theme.
