package com.elixir.service.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// A real, data-backed highlight (e.g. top revenue category, highest order
// day). Only ever built from figures already computed elsewhere in the
// report — never a placeholder or estimated value. Omitted entirely from
// the response when the underlying data doesn't exist for the period.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExecutiveSignal {

    private String label;

    private String value;

    private String helper;
}
