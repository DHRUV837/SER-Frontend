package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.dto.LeaderboardEntry;
import org.example.salesincentivesystem.service.LeaderboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard(
            @RequestParam(defaultValue = "THIS_MONTH") String period) {
        return leaderboardService.getLeaderboard(period);
    }
}
