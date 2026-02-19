package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Invitation;
import org.example.salesincentivesystem.service.InvitationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    private final InvitationService invitationService;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;
    private final org.example.salesincentivesystem.service.EmailService emailService;

    public InvitationController(InvitationService invitationService,
            org.example.salesincentivesystem.repository.UserRepository userRepository,
            org.example.salesincentivesystem.service.EmailService emailService) {
        this.invitationService = invitationService;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateInvite(@RequestParam String token) {
        try {
            Invitation inv = invitationService.validateToken(token);
            // Handle potentially null inviter for robustness
            String inviterName = (inv.getInvitedBy() != null) ? inv.getInvitedBy().getName() : "Company Admin";

            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "email", inv.getEmail(),
                    "invitedBy", inviterName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendInvite(@RequestBody Map<String, Object> body) {
        try {
            String email = (String) body.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            // Get optional parameters
            Long assignedDealId = body.get("assignedDealId") != null
                    ? Long.valueOf(body.get("assignedDealId").toString())
                    : null;
            String role = body.get("role") != null
                    ? body.get("role").toString()
                    : "SALES"; // Default to SALES role

            // Fetch Inviter (Admin) to ensure Organization Linkage
            org.example.salesincentivesystem.entity.User inviter = null;
            if (body.containsKey("invitedBy")) {
                try {
                    Long adminId = Long.parseLong(body.get("invitedBy").toString());
                    inviter = userRepository.findById(adminId).orElse(null);
                } catch (Exception ignored) {
                }
            }

            Invitation invitation = invitationService.createInvitation(email, inviter, assignedDealId, role);

            // AUTO-TRACK ONBOARDING: Mark firstUserInvited for the admin who sent this
            // invitation
            if (inviter != null) {
                try {
                    invitationService.markAdminFirstInvite(inviter.getId());
                } catch (Exception ignored) {
                    // Silently fail if onboarding tracking fails
                }
            }

            // Return the link for testing since email service might not be configured
            String inviteLink = "http://localhost:5173/accept-invite?token=" + invitation.getToken();

            // SEND EMAIL
            String inviterName = (inviter != null) ? inviter.getName() : "Admin";
            String companyName = (inviter != null && inviter.getOrganizationName() != null)
                    ? inviter.getOrganizationName()
                    : "Our Company";

            emailService.sendInvitationEmail(email, inviteLink, inviterName, companyName);

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "Invitation sent successfully");
            response.put("link", inviteLink); // Keep returning link for dev convenience
            response.put("token", invitation.getToken());

            // Include deal info if assigned
            if (assignedDealId != null) {
                response.put("assignedDealId", assignedDealId);
            }
            response.put("role", role);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
