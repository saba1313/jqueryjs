<?php

function jrating_views_tables() {
  
  $tables['jrating_votingapi_cache'] = array(
    'name' => 'votingapi_cache',
    'provider' => 'votingapi',
    'join' => array(
      'left' => array(
        'table' => 'node',
        'field' => 'nid'
      ),
      'right' => array(
        'field' => 'content_id'
      ),
      'extra' => array(
        'content_type' => 'node',
        'value_type' => 'percent',
        'tag' => 'vote',
        'function' => 'average',
      ),
    ),
    'fields' => array(
      'value' => array(
        'name' => t('VotingAPI: Average vote'),
        'sortable' => true,
        'handler' => 'jrating_views_value_display_handler',
        //'query_handler' => 'jrating_views_value_query_handler',
        'option' => array('#type' => 'vote_cache_properties'),
        'addlfields' => array('value_type', 'tag', 'function', 'content_type', 'content_id'),
      ),
    ),
    'sorts' => array(
      'value' => array('name' => t('Voting result'))
    ),
    'filters' => array(
      'value' => array(
        'name' => t('VotingAPI: Average vote'),
        'operator' => views_handler_operator_gtlt(),
        'handler' => 'jrating_views_not_nullable_field_handler',
      ),
    ),
  );
  
  $tables['jrating_votingapi_vote'] = array(
    'name' => 'votingapi_vote', 
    'provider' => 'votingapi',
    'join' => array(
      'left' => array(
        'table' => 'node',
        'field' => 'nid'
      ), 
      'right' => array(
        'field' => 'content_id'
      ),
      'extra' => array(
        'content_type' => 'node',
      ),
    ),
    'fields' => array(
      'value' => array(
        'name' => t('VotingAPI: Vote value'),
        'sortable' => true,
        //'query_handler' => 'votingapi_views_value_query_handler',
        //'handler' => 'jrating_views_value_display_handler',
        'option' => array('#type' => 'vote_properties'),
      ),
      'uid' => array(
        'name' => t('VotingAPI: Voter\'s username'),
        'handler' => 'jrating_views_handler_field_username', 
        'sortable' => true, 
        'uid' => 'uid', 
        'addlfields' => array('uid', 'content_type', 'content_id'),
      ),
      'timestamp' => array(
        'name' => t('VotingAPI: Vote timestamp'),
        'sortable' => true,
        'handler' => 'jrating_views_timestamp_display_handler', 
      ),
      'currentuservoted' => array(
        'notafield' => true,
        'name' => t('VotingAPI: Current user has voted'),
        'handler' => 'jrating_views_handler_field_current_user_voted',
        'content_type' => 'content_type',
        'content_id' => 'content_id',
        'uid' => 'uid',
        'addlfields' => array('content_type', 'content_id'),
      ),
    ),
    'sorts' => array(
      'value' => array('name' => t('VotingAPI: Vote value')),
      'timestamp' => array('name' => t('VotingAPI: Vote timestamp'))
    ),
    'filters' => array(
      'uid' => array(
        'name' => t('VotingAPI: Voted on by'),
        'operator' => array('=' => t('user')),
        'list' => "views_handler_filter_usercurrent",
        'list-type' => 'select',
        'handler' => 'jrating_views_handler_filter_uid_voted',
      ),
    ),
  );

  return $tables;
}

function jrating_views_value_is_nullable_handler($op, $filter, $filterinfo, &$query) {
  $tn = $query->add_table($filterinfo['table']);
  $tname = $query->get_table_name($filterinfo['table'], $tn);
  $query->add_where("$tname.value $filter[operator] NULL");
}

function jrating_views_handler_field_username($fieldinfo, $fielddata, $value, $data) {
  $uidfield = $fielddata['tablename'] . "_"  . $fieldinfo['uid'];
  $user = user_load(array('uid' => $data->$uidfield));
  return theme('username', $user);
}

function jrating_views_nullable_field_handler($op, $filter, $filterinfo, &$query) {
  $tn = $query->add_table($filterinfo['table']);
  $tname = $filter['field'];
  $fop = $filter['operator'];
  $query->add_where("$tname $fop '%s' OR $tname IS NULL", $filter['value']);
}

function jrating_views_not_nullable_field_handler($op, $filter, $filterinfo, &$query) {
  $tn = $query->add_table($filterinfo['table']);
  $tname = $filter['field'];
  $fop = $filter['operator'];
  $query->add_where("$tname $fop '%s'", $filter['value']);
}

function jrating_views_handler_field_current_user_voted($fieldinfo, $fielddata, $value, $data) {
  $content_type_field = $fielddata['tablename'] . "_" . $fieldinfo['content_type'];
  $content_id_field = $fielddata['tablename'] . "_" . $fieldinfo['content_id'];

  return votingapi_get_user_votes($data->$content_type_field, $data->$content_id_field) ? t('Yes') : t('No');
}

function jrating_views_handler_filter_uid_voted($op, $filter, $filterinfo, &$query) {
  $query->add_where("jrating_votingapi_vote.uid $filter[operator] '%s'", $filter['value']);
}

function jrating_views_value_display_handler($op, $filter, $value, &$query) {
  if (!isset($value)) {
    return t('No votes');
  }
  $t = $filter['tablename'] . "_";
  $q = (array)$query;

  $vobj->value = check_plain($value);
  $vobj->value_type =  $q[$t . 'value_type'];
  $vobj->content_type = $q[$t . 'content_type'];
  $vobj->content_id = $q[$t . 'content_id'];
  $vobj->tag = $q[$t . 'tag'];
  if (isset($q[$t . 'function'])) {
    $vobj->function = $q[$t . 'function'];
  }
  if (isset($q[$t . 'uid'])) {
    $vobj->uid = $q[$t . 'uid'];
  }
  $vals = votingapi_invoke('format', $vobj, 'value');
  if (is_array($vals)) {
    return $vals[0];
  } else {
    return $vobj->value;
  }
}

function jrating_views_timestamp_display_handler($op, $filter, $value, &$query) {
  $time = time();
  return format_interval($time - $value, 1);
  //return format_date($value, 'custom', 'Y-d-m');
}

/**
* Default view: table of nodes in order of descending rating, with rating field.
*/
function jrating_views_default_views() {
  $view = new stdClass();
  $view->name = 'nodes_by_rating';
  $view->description = t('Nodes with a rating field');
  $view->access = array (
    );
  $view->view_args_php = '';
  $view->page = TRUE;
  $view->page_title = t('Node ratings');
  $view->page_header = '';
  $view->page_header_format = '1';
  $view->page_footer = '';
  $view->page_footer_format = '1';
  $view->page_empty = '';
  $view->page_empty_format = '1';
  $view->page_type = 'table';
  $view->url = 'rating/nodes';
  $view->use_pager = TRUE;
  $view->nodes_per_page = '20';
  $view->menu = TRUE;
  $view->menu_title = '';
  $view->menu_tab = FALSE;
  $view->menu_tab_default = FALSE;
  $view->menu_tab_weight = '0';
  $view->sort = array (
    array (
      'tablename' => 'votingapi_cache',
      'field' => 'value',
      'sortorder' => 'DESC',
      'options' => '',
      ),
    );
  $view->argument = array (
    );
  $view->field = array (
    array (
      'tablename' => 'node',
      'field' => 'title',
      'label' => t('Title'),
      'handler' => 'views_handler_field_nodelink',
      'options' => 'link',
      ),
    array (
      'tablename' => 'votingapi_cache',
      'field' => 'value',
      'label' => t('Average Rating'),
      'options' => 'a:3:{s:10:"value_type";s:7:"percent";s:3:"tag";s:6:"rating";s:8:"function";s:7:"average";}',
      ),
    array (
      'tablename' => 'votingapi_vote',
      'field' => 'currentuservoted',
      'label' => t('Voted'),
      ),
    );
  $view->filter = array (
    array (
      'tablename' => 'node',
      'field' => 'status',
      'operator' => '=',
      'options' => '',
      'value' => '1',
      ),
    array (
      'tablename' => 'node',
      'field' => 'distinct',
      'operator' => '=',
      'options' => '',
      'value' => array (
        ),
      ),
    );
  $view->exposed_filter = array (
    );
  $view->requires = array(votingapi_cache, node, votingapi_vote);
  $views[$view->name] = $view;
  
  return $views;
}