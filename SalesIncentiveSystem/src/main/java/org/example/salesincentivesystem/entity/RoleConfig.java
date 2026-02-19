package org.example.salesincentivesystem.entity;

import jakarta.persistence.*;

@Entity
public class RoleConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String roleName; // e.g. "MANAGER", "FINANCE"

    @Column(columnDefinition = "TEXT")
    private String permissionsJson; // JSON string: {"deals": "RW", "users": "R"}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getPermissionsJson() {
        return permissionsJson;
    }

    public void setPermissionsJson(String permissionsJson) {
        this.permissionsJson = permissionsJson;
    }
}
