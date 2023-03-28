# Street View Publish

Example app that uses the Street View Publish API to upload Photosphere JPGs to Street View

## Credentials File

Please see https://developers.google.com/streetview/publish/getting-started

You will need to:
  1. Create a developer application, giving it any name you wish
  2. Under Enabled APIs & services, find and add Street View Publish API
  3. Under Credentials, add a Service Account
  4. Under the Keys tab for the Service Account, select Add Key, Create New Key, then pick JSON for key type

This will cause a JSON file to be downloaded with your key information.

Rename the downloaded file to `credentials.json` and place in this directory.
