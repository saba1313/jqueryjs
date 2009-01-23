<?php

ob_start();
include('index.html');
$html = ob_get_contents();
ob_end_clean();

// $index = file_get_contents('index.html');
$guid = 1;

$categories = getcategories('api-docs.xml');

$html = preg_replace('@<p class="loading"><img src="/assets/images/spinner.gif" /> Loading jQuery API database</p>@', $categories, $html);

echo $html;

function getcategories($filename) {
    global $guid;
    $dom= new DOMDocument(); 
    $dom->load('lib/docs/' . $filename); 
    $cats = $dom->getElementsByTagName('cat');

    $html = "<ul id=\"categories\">\n";

    for ($i = 0; $i < $cats->length; $i++) {
        $cat = $cats->item($i);
        $catval = $cat->getAttribute('value');
        $html .= '<li class="heading"><h2><a id="' . $i . '" href="/' . $catval . '">' . $catval . "</a></h2>\n";
        $html .= '<ul class="subcategories">' . "\n";
    
        $subcats = $cat->getElementsByTagName('subcat');
        for ($j = 0; $j < $subcats->length; $j++) {
            $subcat = $subcats->item($j);
            $subcatval = $subcat->getAttribute('value');
        
            $html .= "\t" . '<li id="subcategory' . $j . '"><a href="/' . $catval . '/' . $subcatval . '">' . $subcatval . "</a>\n";

            $html .= "\t" . '<ul class="functions">' . "\n";
            
            getFunctions($subcat);
            
            $html .= "</ul></li>\n";
        }
    
        $html .= "</ul></li>\n";
    }

    return $html;    
}

function getFunctions($subcat) {
    $html = '';
    global $guid;
    
    var_dump($subcat->getElementsByTagName('function'));
    
    $functions = getOrderedElements($subcat, 'function');
    for ($k = 0; $k < count($functions); $k++) {
        $function = $functions[$k];
        $functionval = preg_replace('/^jquery\./i', '$.', $function->getAttribute('name'));
        $id = strtolower(trim($functionval)) . $guid;
        
        // TODO include params here.
        $params = $function->getElementsByTagName('params');
        $all_params = array();
        for ($l = 0; $l < $params->length; $l++) {
            array_push($all_params, $params->item($l)->getAttribute('name'));
        }
        
        $params_str = count($all_params) ? '(' . join($all_params, ', ') . ')' : '';
        
        $html .= "\t\t" . '<li id="' . $id . '"><a href="/' . $catval . '/' . $id . '">' . $functionval . $params_str . '</a></li>';
        $guid++;
    }
    
    return $html;
}

function getOrderedElements($context, $tag) {
    var_dump($context);
    // var $elements = $context->getElementsByTagName($tag);
    // var $ordered = array();
    //     
    //     for ($i = 0; $i < $elements->length; $i++) {
    //         array_push($ordered, $elements->item($i));
    //     }
    //     
    //     return uksort($ordered, 'elOrder');
}

function elOrder($a, $b) {
    return strcasecmp($a->getAttribute('value'), $b->getAttribute('value'));
}

// source: http://uk2.php.net/manual/en/function.xml-parse.php#87920
function xml2array($url, $get_attributes = 1, $priority = 'tag')
{
    $contents = "";
    if (!function_exists('xml_parser_create'))
    {
        return array ();
    }
    $parser = xml_parser_create('');
    if (!($fp = @ fopen($url, 'rb')))
    {
        return array ();
    }
    while (!feof($fp))
    {
        $contents .= fread($fp, 8192);
    }
    fclose($fp);
    xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, "UTF-8");
    xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
    xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
    xml_parse_into_struct($parser, trim($contents), $xml_values);
    xml_parser_free($parser);
    if (!$xml_values)
        return; //Hmm...
    $xml_array = array ();
    $parents = array ();
    $opened_tags = array ();
    $arr = array ();
    $current = & $xml_array;
    $repeated_tag_index = array (); 
    foreach ($xml_values as $data)
    {
        unset ($attributes, $value);
        extract($data);
        $result = array ();
        $attributes_data = array ();
        if (isset ($value))
        {
            if ($priority == 'tag')
                $result = $value;
            else
                $result['value'] = $value;
        }
        if (isset ($attributes) and $get_attributes)
        {
            foreach ($attributes as $attr => $val)
            {
                if ($priority == 'tag')
                    $attributes_data[$attr] = $val;
                else
                    $result['attr'][$attr] = $val; //Set all the attributes in a array called 'attr'
            }
        }
        if ($type == "open")
        { 
            $parent[$level -1] = & $current;
            if (!is_array($current) or (!in_array($tag, array_keys($current))))
            {
                $current[$tag] = $result;
                if ($attributes_data)
                    $current[$tag . '_attr'] = $attributes_data;
                $repeated_tag_index[$tag . '_' . $level] = 1;
                $current = & $current[$tag];
            }
            else
            {
                if (isset ($current[$tag][0]))
                {
                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
                    $repeated_tag_index[$tag . '_' . $level]++;
                }
                else
                { 
                    $current[$tag] = array (
                        $current[$tag],
                        $result
                    ); 
                    $repeated_tag_index[$tag . '_' . $level] = 2;
                    if (isset ($current[$tag . '_attr']))
                    {
                        $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                        unset ($current[$tag . '_attr']);
                    }
                }
                $last_item_index = $repeated_tag_index[$tag . '_' . $level] - 1;
                $current = & $current[$tag][$last_item_index];
            }
        }
        elseif ($type == "complete")
        {
            if (!isset ($current[$tag]))
            {
                $current[$tag] = $result;
                $repeated_tag_index[$tag . '_' . $level] = 1;
                if ($priority == 'tag' and $attributes_data)
                    $current[$tag . '_attr'] = $attributes_data;
            }
            else
            {
                if (isset ($current[$tag][0]) and is_array($current[$tag]))
                {
                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
                    if ($priority == 'tag' and $get_attributes and $attributes_data)
                    {
                        $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                    }
                    $repeated_tag_index[$tag . '_' . $level]++;
                }
                else
                {
                    $current[$tag] = array (
                        $current[$tag],
                        $result
                    ); 
                    $repeated_tag_index[$tag . '_' . $level] = 1;
                    if ($priority == 'tag' and $get_attributes)
                    {
                        if (isset ($current[$tag . '_attr']))
                        { 
                            $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                            unset ($current[$tag . '_attr']);
                        }
                        if ($attributes_data)
                        {
                            $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                        }
                    }
                    $repeated_tag_index[$tag . '_' . $level]++; //0 and 1 index is already taken
                }
            }
        }
        elseif ($type == 'close')
        {
            $current = & $parent[$level -1];
        }
    }
    return ($xml_array);
}

?>