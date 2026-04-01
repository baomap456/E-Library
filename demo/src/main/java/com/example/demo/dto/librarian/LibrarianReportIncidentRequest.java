package com.example.demo.dto.librarian;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LibrarianReportIncidentRequest(
        @NotNull(message = "recordId không được để trống")
        Long recordId,
        @NotBlank(message = "incidentType không được để trống")
        @Size(max = 30, message = "incidentType tối đa 30 ký tự")
        String incidentType,
        @Size(max = 30, message = "damageSeverity tối đa 30 ký tự")
        String damageSeverity,
        Double repairCost,
        Double lostCompensationRate,
        @Size(max = 255, message = "note tối đa 255 ký tự")
        String note) {
}
