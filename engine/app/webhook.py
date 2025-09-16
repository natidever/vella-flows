import os.path
import base64
import json
import requests
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import argparse

WEBHOOK_URL={
    "prod":"https://vellanati.app.n8n.cloud/webhook/da882a01-5a9d-46c2-a3ff-0effcb749ecf",
    "dev":"https://vellanati.app.n8n.cloud/webhook-test/da882a01-5a9d-46c2-a3ff-0effcb749ecf"


}

parser = argparse.ArgumentParser()
parser.add_argument(
    "--vella",
    choices=["dev","prod"],
    default=["prod"]


)

args=parser.parse_args()

webhook_url=WEBHOOK_URL[args.vella]
print(f"running in {args.vella} mode")

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]
# WEBHOOK_URL = 
# WEBHOOK_URL_DEV="https://vellanati.app.n8n.cloud/webhook-test/da882a01-5a9d-46c2-a3ff-0effcb749ecf"

def get_latest_email(service):
    """Fetch the latest email and return as a dictionary"""
    try:
        labels_result = service.users().labels().list(userId="me").execute()
        labels = labels_result.get("labels", [])

        robot_label_id = None
        for label in labels:
            if label["name"] == "Robot":  # Match by display name
                robot_label_id = label["id"]
                
                break

        if not robot_label_id:
            print(" Label 'Robot' not found.") 
            return None

        # Now fetch messages using the label ID
        results = service.users().messages().list(
            userId="me",
            maxResults=1,
            labelIds=[robot_label_id]
        ).execute()

        messages = results.get("messages", [])

        if not messages:
            print("No emails found in inbox.")
            return None

        msg_id = messages[0]['id']
        msg = service.users().messages().get(userId="me", id=msg_id, format="full").execute()

        headers = {h['name']: h['value'] for h in msg['payload']['headers']}
        subject = headers.get('Subject', '(No Subject)')
        sender = headers.get('From', '(Unknown Sender)')
        thread_id = msg.get("threadId")


        parts = msg['payload'].get('parts')
        if parts:
            for part in parts:
                if part['mimeType'] == 'text/plain' and 'data' in part['body']:
                    body = base64.urlsafe_b64decode(part['body']['data'].encode()).decode()
                    break
            else:
                body = "(No text/plain part found)"
        else:
            body_data = msg['payload']['body'].get('data')
            body = base64.urlsafe_b64decode(body_data.encode()).decode() if body_data else "(No body found)"

        email_data = {
            "from": sender,
            "subject": subject,
            "body": body,
            "thread_id":thread_id
        }

        print(f"Latest email fetched: {email_data}")
        return email_data

    except HttpError as error:
        print(f"An error occurred while fetching the email: {error}")
        return None

def send_to_webhook(email_data):
    """Send email data as POST request to n8n webhook"""
    try:
        response = requests.post(webhook_url, json=email_data)
        if response.status_code == 200:
            print("Email sent to n8n webhook successfully.")
        else:
            print(f"Failed to send email. Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"Error sending  POST request: {e}")

def main():
    print("updated code ")
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("gmail", "v1", credentials=creds)
        latest_email = get_latest_email(service)
        if latest_email:
            send_to_webhook(latest_email)
    except HttpError as error:
        print(f"An error occurred while connecting to Gmail API: {error}")

if __name__ == "__main__":
    main()
