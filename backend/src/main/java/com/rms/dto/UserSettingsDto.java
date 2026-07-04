package com.rms.dto;

import lombok.Data;

@Data
public class UserSettingsDto {
    private boolean rolloffAlerts;
    private boolean benchThresholdAlerts;
    private boolean skillGapWarnings;
    private boolean allocationRequests;
    private boolean projectDelayAlerts;
    private boolean weeklySummaryEmail;
}
