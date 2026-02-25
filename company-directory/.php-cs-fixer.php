<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__);

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'single_quote' => true,
        'concat_space' => ['spacing' => 'one'],
        'binary_operator_spaces' => ['default' => 'single_space'],
        'class_attributes_separation' => ['elements' => ['method' => 'one']],
        'no_trailing_whitespace' => true,
        'no_extra_blank_lines' => ['tokens' => ['throw', 'use']],
        'no_whitespace_before_comma_in_array' => true,
        'no_blank_lines_after_class_opening' => true,
        'no_spaces_after_function_name' => true,
        'method_argument_space' => ['on_multiline' => 'ensure_fully_multiline'],
        'new_with_braces' => true,
        'object_operator_without_whitespace' => true,
    ])
    ->setIndent('    ') // 4 spaces
    ->setLineEnding("\n")
    ->setFinder($finder);
