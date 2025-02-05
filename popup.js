// DOM Elements
const curl = document.getElementById("curl");
const output = document.getElementById("output");
const generate = document.getElementById("generate");
const incognitoButton = document.getElementById("incognitoButton");

// Event Listeners
generate.addEventListener("click", handleGenerateClick);
output.addEventListener("click", copyUrl);
incognitoButton.addEventListener('click', openInIncognito);

// Event Handlers
function handleGenerateClick() {
  const value = makeSandboxUrlFromCURL(curl.value) || {};
  output.value = value.output;
  if (value.success) copyUrl();
}

function openInIncognito() {
  chrome.windows.create({
    url: output.value,
    incognito: true
  });
}

// Utility Functions
function copyUrl() {
  window.scrollTo(0, document.body.scrollHeight);
  output.readOnly = false;
  output.select();
  const text = output.value;

  navigator.clipboard.writeText(text)
    .then(() => {
      const copied = document.getElementById("copied");
      copied.classList.add("show");
      output.readOnly = true;
    })
    .catch((error) => {
      console.error("Error copying text: ", error);
      output.readOnly = true;
    });
}

function sanitizeCURL(curl) {
  return curl
    .replace(/\\\\n/g, "\\n")
    .replace(/\\\\t/g, "\\t")
    .replace(/\\\\r/g, "\\r")
    .replace(/--data-raw\s*\$/g, "--data-raw ");
}

function sanitizeHeaders(headers) {
  const sanitizedHeaders = {};
  for (const key in headers) {
    const cleanedKey = key.replace(/'/g, "");
    if (cleanedKey.startsWith("x-vix") || cleanedKey.toLocaleLowerCase() === "authorization") {
      sanitizedHeaders[cleanedKey] = headers[key].replace(/'/g, "");
    }
  }
  return sanitizedHeaders;
}

function makeSandboxUrlFromCURL(curl) {
  const finalCurl = sanitizeCURL(curl);
  const parsed = parse_curl_js.parse(finalCurl);
  if (!parsed || !parsed.url) {
    return { success: false, output: "Invalid cURL command" };
  }

  const endpoint = encodeURIComponent(parsed.url);
  const headers = sanitizeHeaders(parsed.headers || {});
  let bodies = JSON.parse(parsed.body || "{}");
  bodies = Array.isArray(bodies) ? bodies : [bodies]; // Ensure body is an array

  const output = bodies
    .filter(body => body.query)
    .map(body => {
      const input = JSON.stringify({
        document: body.query.trim(),
        variables: JSON.stringify(body.variables || {}, null, 2),
        headers: JSON.stringify(headers),
        includeCookies: "false",
      });

      const explorerURLState = LZString.compressToEncodedURIComponent(input);
      return `https://studio.apollographql.com/sandbox/explorer?endpoint=${endpoint}&explorerURLState=${explorerURLState}`;
    });

  if (!output.length) {
    return { success: false, output: "No valid query found in cURL command" };
  }

  return { success: true, output: output.join("\n\n") };
}
