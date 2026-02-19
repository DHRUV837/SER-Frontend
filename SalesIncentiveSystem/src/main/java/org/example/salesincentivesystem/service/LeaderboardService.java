package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.dto.LeaderboardEntry;
import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final DealRepository dealRepository;

    public LeaderboardService(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    public List<LeaderboardEntry> getLeaderboard(String period) {
        // Fetch all approved deals
        List<Deal> allDeals = dealRepository.findAll().stream()
                .filter(d -> "APPROVED".equalsIgnoreCase(d.getStatus()))
                .filter(d -> d.getUser() != null)
                .collect(Collectors.toList());

        // Filter deals for current period
        List<Deal> currentPeriodDeals = filterDealsByPeriod(allDeals, period, false);

        // Filter deals for previous period (for trend calculation)
        List<Deal> previousPeriodDeals = filterDealsByPeriod(allDeals, period, true);

        // Group current period deals by user
        Map<Long, LeaderboardEntry> userStats = new HashMap<>();

        for (Deal deal : currentPeriodDeals) {
            Long userId = deal.getUser().getId();

            if (!userStats.containsKey(userId)) {
                LeaderboardEntry entry = new LeaderboardEntry();
                entry.setUserId(userId);
                entry.setName(deal.getUser().getName());
                entry.setTotalIncentive(0.0);
                entry.setDeals(0);
                entry.setTotalAmount(0.0);
                userStats.put(userId, entry);
            }

            LeaderboardEntry entry = userStats.get(userId);
            entry.setTotalIncentive(entry.getTotalIncentive() + deal.getIncentive());
            entry.setTotalAmount(entry.getTotalAmount() + deal.getAmount());
            entry.setDeals(entry.getDeals() + 1);
        }

        // Calculate derived metrics
        int totalDealsInPeriod = currentPeriodDeals.size();
        for (LeaderboardEntry entry : userStats.values()) {
            // Average deal size
            entry.setAvgDealSize(entry.getDeals() > 0 ? entry.getTotalAmount() / entry.getDeals() : 0.0);

            // Win rate (percentage of total deals in period)
            entry.setWinRate(totalDealsInPeriod > 0 ? (entry.getDeals() * 100.0) / totalDealsInPeriod : 0.0);
        }

        // Calculate previous period rankings for trend
        Map<Long, Integer> previousRanks = calculateRankings(previousPeriodDeals);

        // Sort by total incentive descending and assign ranks
        List<LeaderboardEntry> sortedEntries = userStats.values().stream()
                .sorted((a, b) -> Double.compare(b.getTotalIncentive(), a.getTotalIncentive()))
                .collect(Collectors.toList());

        for (int i = 0; i < sortedEntries.size(); i++) {
            LeaderboardEntry entry = sortedEntries.get(i);
            int currentRank = i + 1;
            entry.setRank(currentRank);

            // Calculate trend (positive = moved up in rankings)
            Integer previousRank = previousRanks.get(entry.getUserId());
            if (previousRank != null) {
                entry.setTrend(previousRank - currentRank);
            } else {
                entry.setTrend(0); // New to leaderboard
            }
        }

        return sortedEntries;
    }

    private List<Deal> filterDealsByPeriod(List<Deal> deals, String period, boolean previous) {
        LocalDate now = LocalDate.now();

        return deals.stream().filter(deal -> {
            if (deal.getDate() == null)
                return false;

            LocalDate dealDate = deal.getDate();

            switch (period.toUpperCase()) {
                case "THIS_MONTH":
                    if (previous) {
                        YearMonth lastMonth = YearMonth.from(now).minusMonths(1);
                        return YearMonth.from(dealDate).equals(lastMonth);
                    } else {
                        return YearMonth.from(dealDate).equals(YearMonth.from(now));
                    }

                case "LAST_MONTH":
                    YearMonth targetMonth = YearMonth.from(now).minusMonths(previous ? 2 : 1);
                    return YearMonth.from(dealDate).equals(targetMonth);

                case "THIS_YEAR":
                    int targetYear = now.getYear() - (previous ? 1 : 0);
                    return dealDate.getYear() == targetYear;

                case "ALL_TIME":
                default:
                    return !previous; // For all-time, no previous period comparison
            }
        }).collect(Collectors.toList());
    }

    private Map<Long, Integer> calculateRankings(List<Deal> deals) {
        // Group by user and sum incentives
        Map<Long, Double> userIncentives = new HashMap<>();

        for (Deal deal : deals) {
            if (deal.getUser() == null)
                continue;
            Long userId = deal.getUser().getId();
            userIncentives.merge(userId, deal.getIncentive(), Double::sum);
        }

        // Sort by incentive and create rank map
        List<Map.Entry<Long, Double>> sorted = userIncentives.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .collect(Collectors.toList());

        Map<Long, Integer> ranks = new HashMap<>();
        for (int i = 0; i < sorted.size(); i++) {
            ranks.put(sorted.get(i).getKey(), i + 1);
        }

        return ranks;
    }
}
