function generateContent() {
  const topic = document.getElementById("topic").value.trim();
  const platform = document.getElementById("platform").value;
  const tone = document.getElementById("tone").value;
  const output = document.getElementById("output");
  const statusMessage = document.getElementById("statusMessage");

  statusMessage.innerText = "";

  if (!topic) {
    output.innerText = "Please enter a topic first.";
    return;
  }

  let hook = "";
  let caption = "";
  let hashtags = "";
  let callToAction = "";

  if (tone === "professional") {
    hook = "Here’s something worth paying attention to.";
    callToAction = "What do you think about this?";
  } else if (tone === "friendly") {
    hook = "Exciting news to share with you!";
    callToAction = "Let us know your thoughts below.";
  } else if (tone === "bold") {
    hook = "This is changing the game.";
    callToAction = "Ready to be part of it?";
  } else if (tone === "funny") {
    hook = "Well... this just got interesting.";
    callToAction = "Tell us this isn’t awesome.";
  }

  if (platform === "instagram") {
    caption = `📸 ${topic}

${hook}
This is your moment to grab attention, build interest, and connect with your audience in a simple but effective way.

${callToAction}`;

    hashtags = "#socialmedia #contentcreator #marketing #branding #growth";
  }

  if (platform === "linkedin") {
    caption = `🚀 ${topic}

${hook}
Strong ideas deserve clear communication. A simple message can create real engagement, spark discussions, and build credibility.

${callToAction}`;

    hashtags = "#linkedin #business #marketing #personalbranding #growth";
  }

  if (platform === "twitter") {
    caption = `${topic}

${hook}
Keep it simple. Keep it sharp. Keep it memorable.

${callToAction}`;

    hashtags = "#marketing #branding #socialmedia";
  }

  const finalContent = `Hook:
${hook}

Caption:
${caption}

Hashtags:
${hashtags}

Call to Action:
${callToAction}`;

  output.innerText = finalContent;
}

function copyContent() {
  const outputText = document.getElementById("output").innerText;
  const statusMessage = document.getElementById("statusMessage");

  if (!outputText || outputText === "Your generated content will appear here.") {
    statusMessage.innerText = "Nothing to copy yet.";
    return;
  }

  navigator.clipboard.writeText(outputText)
    .then(() => {
      statusMessage.innerText = "Copied successfully.";
    })
    .catch(() => {
      statusMessage.innerText = "Copy failed.";
    });
}