from django.shortcuts import render

# Create your views here.
def index(request, *args, **kwargs):
    # Django finds that file relative to the templates/ folder in each app — not the root of your system.
    # the app-specific templates/ folders when APP_DIRS is set to True, which is true in settings.py in templates section
    return render(request, 'frontend/index.html')

# *args, **kwargs: These are used to accept any additional positional and keyword arguments. This is useful for flexibility, especially when this view might be used in a more dynamic routing context.