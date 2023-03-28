const fs = require('fs');
const StreetViewPublishClient = require('streetview-publish-client-libraries-v1');
const fetch = require('node-fetch');

async function main() {
  process.argv.shift();
  process.argv.shift();
  if (process.argv.length <= 0) {
    console.log('Must provide list of files on command line');
    return;
  }

  let credentials;
  try {
    credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
  } catch {
    console.log(`Unable to read credentials.json.
    Please see https://developers.google.com/streetview/publish/getting-started
    You will need to:
      1. Create a developer application, giving it any name you wish
      2. Under Enabled APIs & services, find and add Street View Publish API
      3. Under Credentials, add a Service Account
      4. Under the Keys tab for the Service Account, select Add Key, Create New Key, then pick JSON for key type
    This will cause a JSON file to be downloaded with your key information.
    Rename the downloaded file to credentials.json and place in this directory.`);
    return;
  }

  const client = new StreetViewPublishClient.StreetViewPublishServiceClient({ credentials });
  const jwt = await client.auth.getAccessToken();

  for (const filename of process.argv) {
    console.log(`Uploading: ${filename}`);

    const [startUploadResponse] = await client.startUpload();
    const { uploadUrl } = startUploadResponse;
    console.log(`Upload URL: ${uploadUrl}`);

    const stats = fs.statSync(filename);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'image/jpeg',
        'X-Goog-Upload-Protocol': 'raw',
        'X-Goog-Upload-Content-Length': stats.size,
      },
      body: fs.createReadStream(filename),
    });
    if (!uploadResponse.ok) {
      console.error(`File upload returned ${uploadResponse.status} ${uploadResponse.statusText}`);
      return;
    }

    const [response] = await client.createPhoto({ photo: { uploadReference: { uploadUrl } } });
    console.log(`Photo Published: ${response.shareLink}`);
  }
}

main();
