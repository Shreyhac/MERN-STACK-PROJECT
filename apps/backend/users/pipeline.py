def save_google_user_data(backend, user, response, *args, **kwargs):
    """Save additional Google user data to the custom user model."""
    if backend.name == "google-oauth2":
        # Update Google ID
        if response.get("sub"):
            user.google_id = response["sub"]

        # Update profile picture
        if response.get("picture"):
            user.profile_picture = response["picture"]

        # Update name fields if not already set
        if response.get("given_name") and not user.first_name:
            user.first_name = response["given_name"]

        if response.get("family_name") and not user.last_name:
            user.last_name = response["family_name"]

        # Save the user
        user.save()

    return {"user": user}
