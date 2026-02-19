package org.example.salesincentivesystem.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SalesProfileRepository salesProfileRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final SalesPerformanceRepository salesPerformanceRepository;
    private final DealRepository dealRepository;
    private final PolicyRepository policyRepository;
    private final ObjectMapper objectMapper;

    public DataInitializer(UserRepository userRepository,
            SalesProfileRepository salesProfileRepository,
            UserPreferenceRepository userPreferenceRepository,
            SalesPerformanceRepository salesPerformanceRepository,
            DealRepository dealRepository,
            PolicyRepository policyRepository) {
        this.userRepository = userRepository;
        this.salesProfileRepository = salesProfileRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.salesPerformanceRepository = salesPerformanceRepository;
        this.dealRepository = dealRepository;
        this.policyRepository = policyRepository;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void run(String... args) {
        try {
            System.out.println("Starting Data Restoration from JSON...");

            // 1. Seed Users from all_users.json
            restoreUsers();

            // 2. Profiles & Preferences (Ensure basic objects exist for all sales users)
            ensureProfilesAndPreferences();

            // 3. Seed Deals from deals.json
            restoreDeals();

            // 4. Seed Policies and Targets
            restorePolicies();
            restoreTargets();

            System.out.println("100% AUTHENTIC DATA RESTORED SUCCESSFULLY!");

        } catch (Exception e) {
            System.err.println("Error during data restoration: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void restoreUsers() throws Exception {
        InputStream is = new ClassPathResource("all_users.json").getInputStream();
        List<User> users = objectMapper.readValue(is, new TypeReference<List<User>>() {
        });

        for (User u : users) {
            if (userRepository.findByEmail(u.getEmail()).isEmpty()) {
                // Ensure IDs are not forced if we want DB to generate them,
                // but since we want to keep relations, we might need to be careful.
                // For now, let's just save and let JPA handle it, we will link deals by email.
                u.setId(null);
                userRepository.save(u);
                System.out.println("Restored user: " + u.getEmail());
            }
        }
    }

    private void ensureProfilesAndPreferences() {
        userRepository.findAll().forEach(u -> {
            if ("SALES".equals(u.getRole())) {
                if (salesProfileRepository.findAll().stream()
                        .noneMatch(p -> p.getUser().getId().equals(u.getId()))) {
                    salesProfileRepository.save(new org.example.salesincentivesystem.entity.SalesProfile(u,
                            "555-0100", "Sales", "EMP-" + u.getId(), java.time.LocalDate.now().minusYears(1)));
                }
                if (userPreferenceRepository.findAll().stream()
                        .noneMatch(p -> p.getUser().getId().equals(u.getId()))) {
                    userPreferenceRepository.save(
                            new org.example.salesincentivesystem.entity.UserPreference(u, "light", "INR", "en"));
                }
                if (salesPerformanceRepository.findAll().stream()
                        .noneMatch(p -> p.getUser().getId().equals(u.getId()))) {
                    salesPerformanceRepository.save(new org.example.salesincentivesystem.entity.SalesPerformance(u,
                            0.0, 0.0, "Authentic User"));
                }
            }
        });
    }

    private void restoreDeals() throws Exception {
        // TEMPORARILY DISABLED: Allow reloading deals from JSON
        // if (dealRepository.count() > 0) {
        // System.out.println("Deals already exist. Skipping deal restoration.");
        // return;
        // }

        // Clear existing deals to avoid duplicates
        long existingCount = dealRepository.count();
        if (existingCount > 0) {
            System.out.println("Clearing " + existingCount + " existing deals before reload...");
            dealRepository.deleteAll();
        }

        System.out.println("Loading deals from deals.json...");

        InputStream is = new ClassPathResource("deals.json").getInputStream();
        // Since deals.json has nested user objects with IDs that might not match the
        // new DB IDs,
        // we'll read it as a list of maps first and then manually link.
        List<Map<String, Object>> dealsData = objectMapper.readValue(is,
                new TypeReference<List<Map<String, Object>>>() {
                });

        for (Map<String, Object> data : dealsData) {
            Map<String, Object> userData = (Map<String, Object>) data.get("user");
            String email = (String) userData.get("email");

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                Deal deal = new Deal();
                deal.setUser(userOpt.get());
                deal.setDate(java.time.LocalDate.parse((String) data.get("date")));
                deal.setAmount(((Number) data.get("amount")).doubleValue());
                deal.setIncentive(((Number) data.get("incentive")).doubleValue());
                deal.setRate(((Number) data.get("rate")).doubleValue());
                deal.setStatus((String) data.get("status"));

                // Map additional fields if they exist in the JSON
                if (data.containsKey("dealName"))
                    deal.setDealName((String) data.get("dealName"));
                if (data.containsKey("clientName"))
                    deal.setClientName((String) data.get("clientName"));
                if (data.containsKey("organizationName"))
                    deal.setOrganizationName((String) data.get("organizationName"));

                dealRepository.save(deal);
                System.out.println("Restored deal for: " + email);
            }
        }
    }

    private void restorePolicies() {
        if (policyRepository.count() == 0) {
            org.example.salesincentivesystem.entity.Policy p = new org.example.salesincentivesystem.entity.Policy();
            p.setTitle("Standard Commission");
            p.setType("INCENTIVE");
            p.setCommissionRate(10.0);
            p.setDescription("Standard 10% commission on all deals.");
            p.setActive(true);
            p.setLastUpdated(java.time.LocalDateTime.now());
            policyRepository.save(p);
            System.out.println("Seeded Default Incentive Policy: 10%");
        }
    }

    private void restoreTargets() {
        userRepository.findAll().forEach(u -> {
            if ("SALES".equals(u.getRole())) {
                salesPerformanceRepository.findByUserId(u.getId()).ifPresent(p -> {
                    if (p.getCurrentMonthTarget() == 0.0) {
                        p.setCurrentMonthTarget(500000.0);
                        p.setAchievements("Standard Performance Target");
                        salesPerformanceRepository.save(p);
                        System.out.println("Set 500k Target for: " + u.getEmail());
                    }
                });
            }
        });
    }
}
