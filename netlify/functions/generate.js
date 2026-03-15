const OpenAI = require("openai");

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const { topic, platform, tone } = JSON.parse(event.body || "{}");

    if (!topic || !platform || !tone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing topic, platform, or tone." }),
      };
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are a social media content assistant.

Generate content for:
- Topic: ${topic}
- Platform: ${platform}
- Tone: ${tone}

Return the result in this exact format:

Hook:
...

Caption:
...

Hashtags:
...

Call to Action:
...
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: prompt,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: response.output_text,
      }),
    };
  } catch (error) {
    console.error("Function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong while generating content.",
      }),
    };
  }
};