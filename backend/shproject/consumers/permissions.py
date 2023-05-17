from rest_framework.permissions import BasePermission

class IsConnectedProfileParticipant(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        connected_profile = obj.connected_profile
        return connected_profile in user.profile.connections.all()
