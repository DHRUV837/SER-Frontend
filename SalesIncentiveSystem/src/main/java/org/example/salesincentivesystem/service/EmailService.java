package org.example.salesincentivesystem.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Welcome to Sales Reward Engine - Enterprise Edition");

            String htmlContent = """
                        <html>
                        <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; padding: 20px;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                                <div style="background: linear-gradient(135deg, #4f46e5 0%%, #7c3aed 100%%); padding: 40px 20px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Sales Reward Engine</h1>
                                    <p style="color: #e0e7ff; margin-top: 8px; font-size: 16px;">Enterprise Sales Performance Platform</p>
                                </div>

                                <div style="padding: 40px 30px;">
                                    <h2 style="color: #1f2937; margin-top: 0; font-size: 22px; font-weight: 700;">Welcome aboard, %s! 🚀</h2>

                                    <p style="color: #4b5563; font-size: 16px; margin-top: 16px;">
                                        We are thrilled to have you join our enterprise platform. Your workspace has been successfully created and is ready for action.
                                    </p>

                                    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
                                        <p style="margin: 0; color: #1e40af; font-size: 14px;">
                                            <strong>Pro Tip:</strong> Start by inviting your sales team and configuring your first incentive policy to see immediate results.
                                        </p>
                                    </div>

                                    <p style="color: #4b5563; font-size: 16px;">
                                        You can now access your dashboard to view your incentives, track real-time performance, and manage your deals with our advanced analytics tools.
                                    </p>

                                    <div style="margin: 32px 0; text-align: center;">
                                        <a href="http://localhost:5173/login" style="display: inline-block; background-color: #4f46e5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); transition: background-color 0.2s;">
                                            Access Dashboard
                                        </a>
                                    </div>

                                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

                                    <p style="color: #6b7280; font-size: 14px;">
                                        If you have any questions or need assistance setting up your workspace, our dedicated support team is available 24/7.
                                    </p>
                                </div>

                                <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <div style="margin-bottom: 12px;">
                                        <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 12px;">Help Center</a>
                                        <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 12px;">Privacy Policy</a>
                                        <a href="#" style="color: #6b7280; text-decoration: none; margin: 0 8px; font-size: 12px;">Terms of Service</a>
                                    </div>
                                    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                                        &copy; 2026 Sales Reward Engine. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    """
                    .formatted(name);

            helper.setText(htmlContent, true);

            helper.setFrom("teamsalesrewardengine@gmail.com");

            mailSender.send(message);
            System.out.println("Welcome email sent to " + to);

        } catch (Exception e) {
            System.err.println("SMTP Config not found, printing email to console:");
            System.out.println("==================================================");
            System.out.println("From: noreply@salesrewardengine.com");
            System.out.println("To: " + to);
            System.out.println("Subject: Welcome to Sales Reward Engine - Enterprise Edition");
            System.out.println("Content: Welcome aboard, " + name + "! Your account is ready.");
            System.out.println("==================================================");
            // Don't block registration if email fails
        }
    }

    // Removed @Async for synchronous feedback
    public void sendInvitationEmail(String to, String inviteLink, String inviterName, String companyName)
            throws Exception {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("You've been invited to join " + companyName + " on Sales Reward Engine");

            String htmlContent = """
                        <html>
                        <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; padding: 20px;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                                <div style="background: linear-gradient(135deg, #4f46e5 0%%, #7c3aed 100%%); padding: 32px 20px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Sales Reward Engine</h1>
                                </div>

                                <div style="padding: 40px 30px;">
                                    <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Hello there!</h2>

                                    <p style="color: #4b5563; font-size: 16px;">
                                        <strong>%s</strong> from <strong>%s</strong> has invited you to join their sales team on Sales Reward Engine.
                                    </p>

                                    <p style="color: #4b5563; font-size: 16px;">
                                        Accept the invitation to start tracking your deals, viewing your real-time performance, and earning rewards.
                                    </p>

                                    <div style="margin: 32px 0; text-align: center;">
                                        <a href="%s" style="display: inline-block; background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                                            Join the Team
                                        </a>
                                    </div>

                                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                                        This invitation link will expire in 48 hours. If you didn't expect this invitation, you can safely ignore this email.
                                    </p>
                                </div>

                                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                                        &copy; 2026 Sales Reward Engine. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    """
                    .formatted(inviterName, companyName, inviteLink);

            helper.setText(htmlContent, true);
            helper.setFrom("teamsalesrewardengine@gmail.com");

            mailSender.send(message);
            System.out.println("Invitation email sent to " + to);

        } catch (Exception e) {
            System.err.println("Failed to send invitation email: " + e.getMessage());
            e.printStackTrace();
            System.err.println("SMTP Config error or Connection failed. Printing invitation to console:");
            System.out.println("==================================================");
            System.out.println("To: " + to);
            System.out.println("Subject: You've been invited to join " + companyName);
            System.out.println("Invited By: " + inviterName);
            System.out.println("Link: " + inviteLink);
            System.out.println("==================================================");
            throw e; // Rethrow to propagate error via API response
        }
    }
}
