<?php 

    include "connection.php";
    header('Content-Type: application/json');
    require __DIR__ . '/../vendor/autoload.php'; // Correct path to autoload
    use Orhanerday\OpenAi\OpenAi;

    $open_ai_key = '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';
    $open_ai = new OpenAi($open_ai_key);

    $prompt = isset($_POST['prompt']) ? $_POST['prompt'] : null;
    $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null; 

    if ($prompt) {
        // Load the movie data from a JSON file
        $movies = json_decode(file_get_contents(__DIR__ . "/../movies.json"), true);
        $movieFound = false;
        $responseText = "I don’t know about that movie.";

        // Check if any movie in the JSON matches the user input
        foreach ($movies as $movie) {
            if (stripos($prompt, $movie['title']) !== false) {
                $responseText = "Here are the details for {$movie['title']}:<br>
                    <strong>Summary:</strong> {$movie['additionalData']['summary']},<br>
                    <strong>Genres:</strong> {$movie['genres']},<br>
                ";
                if (!empty($movie['additionalData']['directors'])){
                    $responseText .= "<strong>Directors:</strong> {$movie['additionalData']['directors']}<br>";
                }
                if (!empty($movie['additionalData']['cast']) && is_array($movie['additionalData']['cast'])) {
                    $castList = implode(" ", $movie['additionalData']['cast']);
                    $responseText .= "<strong>Cast:</strong> {$castList}<br>";
                }
                $responseText .= "Duration: {$movie['duration']}<br>";
                if (!empty($movie['additionalData']['releaseDate'])){
                    $responseText .= "<strong>Released Date:</strong> {$movie['additionalData']['releaseDate']}<br>";
                }

                $likes = !empty($movie['additionalData']['numberOfLikes']) ? $movie['additionalData']['numberOfLikes'] : "0";
                $responseText .= "<strong>Number of likes:</strong> {$likes}<br>";

                if (!empty($movie['additionalData']['nationality'])){
                    $responseText .= "<strong>Nationality:</strong> {$movie['additionalData']['nationality']}<br>";
                }

                $movieFound = true;
                break;
            }
        }

        if (!$movieFound) {
            // If movie is not found, send it to OpenAI API to handle other prompts
            $url = "https://api.openai.com/v1/chat/completions";
            $data = [
                "model" => "gpt-3.5-turbo",
                "messages" => [
                    ["role" => "system", "content" => "You are Robimo, a chatbot that can only provide information about movies in the given movie database. You must only respond with movie details from the provided JSON file, and if the movie is not found, respond with 'Sorry, movie not found in the database.' Do not answer anything that is not related to movies or outside the data provided."],
                    ["role" => "user", "content" => $prompt]
                ],
                "temperature" => 0.9,
                "max_tokens" => 150
            ];

            // cURL request to OpenAI
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "Content-Type: application/json",
                "Authorization: Bearer $open_ai_key"
            ]);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            $response = curl_exec($ch);
            curl_close($ch);

            $responseData = json_decode($response, true);
            if (isset($responseData["choices"][0]["message"]["content"])) {
                $responseText = $responseData["choices"][0]["message"]["content"];
            }
        }
        
        $chat_id = 1;
        $query = $connection->prepare("INSERT INTO ai_chatbot (user_id, chat_id, prompt, response) VALUES (?, ?, ?, ?)");
        $query->bind_param("iiss", $user_id, $chat_id, $prompt, $responseText); 
        $query->execute();

        echo json_encode(["response" => $responseText]);
    } 
?>
