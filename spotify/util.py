from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
import requests


BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    print(user_tokens)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    if not all([access_token, token_type, expires_in]):
        print(f"Cannot save tokens, missing data. Access token: {access_token}, token_type: {token_type}, expires_in: {expires_in}")
        return

    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)

        return True

    return False


def refresh_spotify_token(session_id):
    tokens = get_user_tokens(session_id)
    if not tokens:
        print(f"No tokens found for session {session_id}")
        return

    refresh_token = tokens.refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    # Check for error in response
    if 'error' in response:
        print(f"Error refreshing token: {response}")
        return  # Do NOT call update_or_create_user_tokens

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    new_refresh_token = response.get('refresh_token') or refresh_token

    # Check required fields
    if not all([access_token, token_type, expires_in]):
        print(f"Missing fields in response: {response}")
        return

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, new_refresh_token)



def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    if not tokens:
        print("No tokens found for session:", session_id)
        return {'Error': 'No tokens found'}

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f"Bearer {tokens.access_token}"
    }

    if post_:
        response = requests.post(BASE_URL + endpoint, headers=headers)
    elif put_:
        response = requests.put(BASE_URL + endpoint, headers=headers)
    else:
        response = requests.get(BASE_URL + endpoint, headers=headers)

    print(f"Request URL: {BASE_URL + endpoint}")
    print(f"Response Status: {response.status_code}")

    if response.status_code == 204:
        print("No content returned (204)")
        return {'Error': 'No song currently playing'}
    if response.status_code == 401:
        print("Unauthorized (401) - token may be expired")
        return {'Error': 'Unauthorized - token may have expired'}
    if response.status_code != 200:
        print(f"Error response: {response.text}")
        return {'Error': f"Spotify returned status {response.status_code}"}

    try:
        return response.json()
    except ValueError:
        print(f"Invalid JSON in response: {response.text}")
        return {'Error': 'Invalid JSON response'}

def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)