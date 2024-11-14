<?php 

    require __DIR__ . '/../vendor/autoload.php'; // Correct path to autoload

    use Orhanerday\OpenAi\OpenAi;

    $open_ai_key = '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';

    $open_ai = new OpenAi($open_ai_key);

    // Get the prompt from the POST request
    $prompt = isset($_POST['prompt']) ? $_POST['prompt'] : null;

    // Check if prompt is provided
    if ($prompt) {
        
        $url = "https://api.openai.com/v1/chat/completions";

        $data = [
            "model" => "gpt-3.5-turbo",
            "messages" => [
                [
                    "role" => "system",
                    "content" => "You are Ribimo, a chatbot that recommends movies based on the given details."
                ],
                [
                    "role" => "user",
                    "content" => $prompt
                ]
            ],
            "temperature" => 0.9,
            "max_tokens" => 150,
            "frequency_penalty" => 0,
            "presence_penalty" => 0.6
        ];

        // Initialize cURL session
        $ch = curl_init($url);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Authorization: Bearer $open_ai_key"
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

        // Execute the cURL request
        $response = curl_exec($ch);

        // Close cURL session
        curl_close($ch);

        // Decode the response
        $responseData = json_decode($response, true);

        if (isset($responseData["choices"][0]["message"]["content"])) {
            $responseText = $responseData["choices"][0]["message"]["content"];
            echo json_encode(["response" => $responseText]);

        } else {
            echo json_encode(["error" => "No valid response from OpenAI."]);
        }
    } 

?>
