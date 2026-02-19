package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.entity.Invitation;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.InvitationRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;

    public InvitationService(InvitationRepository invitationRepository, UserRepository userRepository) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
    }

    public Invitation createInvitation(String email, User inviter, Long assignedDealId, String role) {
        String token = UUID.randomUUID().toString();
        // Expires in 48 hours
        LocalDateTime expiry = LocalDateTime.now().plusHours(48);

        Invitation invitation = new Invitation(email, token, inviter, expiry);

        // Set optional deal assignment
        if (assignedDealId != null) {
            invitation.setAssignedDealId(assignedDealId);
        }

        // Store role in invitation (we'll use this during signup)
        // Note: Invitation entity should have a role field, but if not, we can pass it
        // separately

        return invitationRepository.save(invitation);
    }

    public Invitation validateToken(String token) throws Exception {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new Exception("Invalid invitation token"));

        if (invitation.getExpiryDate().isBefore(LocalDateTime.now())) {
            invitation.setStatus("EXPIRED");
            invitationRepository.save(invitation);
            throw new Exception("Invitation has expired");
        }

        if (!"PENDING".equals(invitation.getStatus())) {
            throw new Exception("Invitation is already used or invalid");
        }

        return invitation;
    }

    public void markAccepted(Invitation invitation) {
        invitation.setStatus("ACCEPTED");
        invitationRepository.save(invitation);
    }

    /**
     * Mark admin's firstUserInvited as true for onboarding tracking
     */
    public void markAdminFirstInvite(Long adminId) {
        userRepository.findById(adminId).ifPresent(admin -> {
            if (Boolean.FALSE.equals(admin.getFirstUserInvited())) {
                admin.setFirstUserInvited(true);
                userRepository.save(admin);
            }
        });
    }
}
