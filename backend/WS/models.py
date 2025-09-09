from django.db import models
    
# app/models.py
import uuid
from django.db import models
from django.contrib.postgres.fields import JSONField  # or models.JSONField for Django 3.1+

class Whiteboard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Stroke(models.Model):
    id = models.BigAutoField(primary_key=True)
    whiteboard = models.ForeignKey(Whiteboard, related_name="strokes", on_delete=models.CASCADE)
    stroke_id = models.UUIDField()   # client-provided UUID for this stroke (idempotency)
    user_id = models.CharField(max_length=200, null=True, blank=True)
    color = models.CharField(max_length=32, default="#000")
    points = models.JSONField(default=list)   # list of [x,y] or {x:.., y:..}
    finished = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("whiteboard", "stroke_id")
        indexes = [
            models.Index(fields=["whiteboard", "stroke_id"]),
        ]
