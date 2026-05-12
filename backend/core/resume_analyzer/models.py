from django.conf import settings
from django.db import models

class Resume(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes",
        null=True,
        blank=True,
    )
    file = models.FileField(upload_to="resumes/")
    analysis = models.TextField(blank=True)
    improved_resume = models.TextField(blank=True)
    score = models.PositiveIntegerField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        owner = self.user.username if self.user else "anonymous"
        return f"{owner} - {self.file.name}"
