from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content', 'file']
        widgets = {
            'content': forms.Textarea(attrs={'rows': 3}),
        }