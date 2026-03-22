const supabaseUrl = "https://dptqexriuckimfcgtfuk.supabase.co";
const supabaseKey = "sb_publishable_GQAO2doyOgjXepAL9YPGFw__qn-sJzi";
const sb = window.supabase.createClient(supabaseUrl, supabaseKey);

async function updateAuthUI() {
  const authStatus = document.getElementById("authStatus");
  const authMessage = document.getElementById("authMessage");

  if (!authStatus || !authMessage) return;

  const {
    data: { user },
    error
  } = await sb.auth.getUser();

  if (error) {
    authStatus.innerText = "Error";
    authMessage.innerText = error.message;
    return;
  }

  if (user) {
    authStatus.innerText = "Logged in";
    authMessage.innerText = `Logged in as: ${user.email}`;
  } else {
    authStatus.innerText = "Logged out";
    authMessage.innerText = "No user logged in.";
  }
}

async function signUp() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const authMessage = document.getElementById("authMessage");

  if (!email || !password) {
    if (authMessage) authMessage.innerText = "Please enter email and password.";
    return;
  }

  const { error } = await sb.auth.signUp({
    email,
    password
  });

  if (error) {
    if (authMessage) authMessage.innerText = error.message;
    return;
  }

  if (authMessage) {
    authMessage.innerText =
      "Signup successful. Check your email if confirmation is enabled.";
  }

  await updateAuthUI();
}

async function signIn() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const authMessage = document.getElementById("authMessage");

  if (!email || !password) {
    if (authMessage) authMessage.innerText = "Please enter email and password.";
    return;
  }

  const { error } = await sb.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    if (authMessage) authMessage.innerText = error.message;
    return;
  }

  if (authMessage) authMessage.innerText = "Login successful.";
  await updateAuthUI();
}

async function signOutUser() {
  const authMessage = document.getElementById("authMessage");

  const { error } = await sb.auth.signOut();

  if (error) {
    if (authMessage) authMessage.innerText = error.message;
    return;
  }

  if (authMessage) authMessage.innerText = "Logged out successfully.";
  await updateAuthUI();
}

async function generateContent() {
  const topic = document.getElementById("topic").value.trim();
  const platform = document.getElementById("platform").value;
  const tone = document.getElementById("tone").value;
  const output = document.getElementById("output");
  const statusMessage = document.getElementById("statusMessage");
  const authMessage = document.getElementById("authMessage");

  if (statusMessage) statusMessage.innerText = "";

  const {
    data: { user }
  } = await sb.auth.getUser();

  if (!user) {
    output.innerText = "Please log in first.";
    if (authMessage) {
      authMessage.innerText = "You must be logged in to generate content.";
    }
    return;
  }

  if (!topic) {
    output.innerText = "Please enter a topic first.";
    return;
  }

  output.innerText = "Generating content...";

  try {
    const {
      data: { session }
    } = await sb.auth.getSession();

    const accessToken = session?.access_token;

    const response = await fetch("/.netlify/functions/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        topic,
        platform,
        tone
      })
    });

    const data = await response.json();

    if (!response.ok) {
      output.innerText = data.error || "Something went wrong.";
      if (statusMessage) statusMessage.innerText = "Generation failed.";
      return;
    }

    output.innerText = data.result;
    if (statusMessage) statusMessage.innerText = "Generated with AI.";
  } catch (error) {
    console.error("Frontend error:", error);
    output.innerText = "Could not connect to the AI function.";
    if (statusMessage) statusMessage.innerText = "Connection failed.";
  }
}

function copyContent() {
  const outputText = document.getElementById("output").innerText;
  const statusMessage = document.getElementById("statusMessage");

  if (!outputText || outputText === "Your generated content will appear here.") {
    if (statusMessage) statusMessage.innerText = "Nothing to copy yet.";
    return;
  }

  navigator.clipboard.writeText(outputText)
    .then(() => {
      if (statusMessage) statusMessage.innerText = "Copied successfully.";
    })
    .catch(() => {
      if (statusMessage) statusMessage.innerText = "Copy failed.";
    });
}

window.addEventListener("load", async () => {
  await updateAuthUI();

  sb.auth.onAuthStateChange(async () => {
    await updateAuthUI();
  });
});
