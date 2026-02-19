package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.RoleConfig;
import org.example.salesincentivesystem.repository.RoleConfigRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleConfigRepository roleRepository;

    public RoleController(RoleConfigRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public List<RoleConfig> getAllRoles() {
        List<RoleConfig> roles = roleRepository.findAll();
        // Seed default roles if empty
        if (roles.isEmpty()) {
            createDefaultRole("MANAGER", "{\"deals\":\"RW\",\"users\":\"R\",\"payouts\":\"R\"}");
            createDefaultRole("FINANCE", "{\"deals\":\"R\",\"users\":\"R\",\"payouts\":\"RW\"}");
            createDefaultRole("Analyst", "{\"deals\":\"R\",\"users\":\"R\",\"payouts\":\"R\",\"reports\":\"RW\"}");
            return roleRepository.findAll();
        }
        return roles;
    }

    private void createDefaultRole(String name, String json) {
        RoleConfig r = new RoleConfig();
        r.setRoleName(name);
        r.setPermissionsJson(json);
        roleRepository.save(r);
    }

    @PostMapping
    public RoleConfig updateRole(@RequestBody RoleConfig role) {
        RoleConfig existing = roleRepository.findByRoleName(role.getRoleName())
                .orElse(new RoleConfig());

        existing.setRoleName(role.getRoleName());
        existing.setPermissionsJson(role.getPermissionsJson());
        return roleRepository.save(existing);
    }
}
