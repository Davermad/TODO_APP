"""
Module for models configuration of core app
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


class Todo(models.Model):
    """Model representing a todo item in the system."""

    class StatusChoice(models.TextChoices):
        """Status choices for todo items."""
        IN_PROGRESS = 'in_progress', _('In Progress')
        COMPLETED = 'completed', _('Completed')
        CANCELLED = 'cancelled', _('Cancelled')
        
    name = models.CharField(max_length=200, help_text=_("Name of the todo item"))
    description = models.TextField(blank=True, help_text=_("Detailed description of the todo"))
    status = models.CharField(
        max_length=20,
        choices=StatusChoice.choices,
        default=StatusChoice.IN_PROGRESS,
        help_text=_("Current status of the todo item")
    )
    priority = models.PositiveSmallIntegerField(
        default=3,
        choices=[(1, _('High')), (2, _('Medium')), (3, _('Low'))],
        help_text=_("Priority level of the todo item")
    )
    due_date = models.DateField(null=True, blank=True, help_text=_("Due date for this todo item"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

    class Meta:
        ordering = ['priority', 'due_date', 'created_at']
        verbose_name = _("Todo Item")
        verbose_name_plural = _("Todo Items")

    def is_completed(self):
        """Check if the todo item is completed."""
        return self.status == self.StatusChoice.COMPLETED

    def is_overdue(self):
        """Check if the todo item is overdue."""
        from django.utils import timezone
        return self.due_date and self.due_date < timezone.now().date() and self.status != self.StatusChoice.COMPLETED
