<?php 

require __DIR__ . '/../vendor/autoload.php'; // Correct path to autoload

use Orhanerday\OpenAi\OpenAi;

$open_ai_key = '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';

$open_ai = new OpenAi($open_ai_key);

// Get the prompt from the POST request
$prompt = isset($_POST['prompt']) ? $_POST['prompt'] : null;

// Check if prompt is provided
if ($prompt) {
    // Call the OpenAI API with the prompt
    $complete = $open_ai->completion([
        'model' => 'gpt-3.5-turbo',
        'prompt' => 'You are Ribimo and you can only use the movies and their details in the given data.' . $prompt,
        'temperature' => 0.9,
        'max_tokens' => 150,
        'frequency_penalty' => 0,
        'presence_penalty' => 0.6,
    ]);
    echo $complete;

    // Decode the response
    $response = json_decode($complete, true);


    // Check if response is valid
    if (isset($response["choices"][0]["text"])) {
        $responseText = $response["choices"][0]["text"];
        echo $responseText;  // Output the generated text
    } else {
        echo json_encode(["Error: No valid response from OpenAI."]);
    }
} else {
    echo json_encode(["Error: No prompt provided."]);
}
?>
