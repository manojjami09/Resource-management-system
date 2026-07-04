package com.rms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private boolean rolloffAlerts = true;

    @Column(nullable = false)
    private boolean benchThresholdAlerts = true;

    @Column(nullable = false)
    private boolean skillGapWarnings = true;

    @Column(nullable = false)
    private boolean allocationRequests = true;

    @Column(nullable = false)
    private boolean projectDelayAlerts = false;

    @Column(nullable = false)
    private boolean weeklySummaryEmail = true;

}
