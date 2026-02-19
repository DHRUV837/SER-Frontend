package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MigrationService {

    private final DealRepository dealRepository;

    public MigrationService(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    /**
     * Run on startup to ensure all existing deals follow the new data model
     * requirements.
     */
    @PostConstruct
    public void migrateLegacyDeals() {
        List<Deal> deals = dealRepository.findAll();
        List<Deal> legacyDeals = deals.stream()
                .filter(d -> d.getDealName() == null || !d.isLegacyDeal())
                .collect(Collectors.toList());

        if (legacyDeals.isEmpty()) {
            return;
        }

        System.out.println("Migrating " + legacyDeals.size() + " legacy deals...");

        for (Deal deal : legacyDeals) {
            // Set legacy flag
            deal.setLegacyDeal(true);

            // Backfill mandatory fields if missing
            if (deal.getDealName() == null || deal.getDealName().isEmpty()) {
                deal.setDealName("Legacy Deal #" + deal.getId());
            }
            if (deal.getOrganizationName() == null || deal.getOrganizationName().isEmpty()) {
                deal.setOrganizationName("Legacy Org");
            }
            if (deal.getClientName() == null || deal.getClientName().isEmpty()) {
                deal.setClientName(deal.getOrganizationName());
            }
            if (deal.getIndustry() == null || deal.getIndustry().isEmpty()) {
                deal.setIndustry("Legacy");
            }
            if (deal.getRegion() == null || deal.getRegion().isEmpty()) {
                deal.setRegion("Unknown");
            }
            if (deal.getCurrency() == null || deal.getCurrency().isEmpty()) {
                deal.setCurrency("₹");
            }

            dealRepository.save(deal);
        }

        System.out.println("Legacy deal migration completed successfully.");
    }
}
