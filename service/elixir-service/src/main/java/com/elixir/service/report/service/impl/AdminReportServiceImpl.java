package com.elixir.service.report.service.impl;

import com.elixir.service.common.exception.BusinessValidationException;
import com.elixir.service.order.entity.OrderStatus;
import com.elixir.service.order.entity.PaymentMethod;
import com.elixir.service.order.repository.OrderItemRepository;
import com.elixir.service.order.repository.OrderRepository;
import com.elixir.service.report.dto.AdminReportResponse;
import com.elixir.service.report.dto.CategoryBreakdownItem;
import com.elixir.service.report.dto.ExecutiveSignal;
import com.elixir.service.report.dto.PaymentBreakdownItem;
import com.elixir.service.report.dto.ReportComparison;
import com.elixir.service.report.dto.ReportPeriod;
import com.elixir.service.report.dto.ReportSummary;
import com.elixir.service.report.dto.RevenueTrendPoint;
import com.elixir.service.report.dto.TopProductItem;
import com.elixir.service.report.service.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminReportServiceImpl implements AdminReportService {

    // Revenue rule for the whole Reports module, kept identical to the
    // existing Dashboard convention (AdminDashboardServiceImpl.getSummary):
    // DELIVERED is the real terminal/completed status in this workflow —
    // see OrderServiceImpl.ORDER_STATUS_TRANSITIONS, where Sprint 3 only
    // removed DELIVERED from the admin's manual status-edit dropdown; it
    // remains reachable via SHIPPED -> DELIVERED and is what "completed"
    // means for revenue purposes everywhere in this codebase.
    private static final OrderStatus REVENUE_STATUS = OrderStatus.DELIVERED;
    private static final String REVENUE_RULE_NOTE = "Revenue includes DELIVERED orders only.";

    private static final DateTimeFormatter PERIOD_LABEL_FORMAT = DateTimeFormatter.ofPattern("d MMMM yyyy");
    private static final DateTimeFormatter DAY_LABEL_FORMAT = DateTimeFormatter.ofPattern("dd MMM");
    private static final DateTimeFormatter MONTH_LABEL_FORMAT = DateTimeFormatter.ofPattern("MMM yyyy");

    private static final long MAX_RANGE_DAYS = 730; // 2 years — defensive guard against pathological custom ranges

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    private record TrendResult(String grouping, List<RevenueTrendPoint> points) {
    }

    @Override
    @Transactional(readOnly = true)
    public AdminReportResponse getSummary(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new BusinessValidationException("startDate and endDate are required");
        }
        if (startDate.isAfter(endDate)) {
            throw new BusinessValidationException("startDate must not be after endDate");
        }
        if (ChronoUnit.DAYS.between(startDate, endDate) > MAX_RANGE_DAYS) {
            throw new BusinessValidationException("Custom date range cannot exceed 2 years");
        }

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.plusDays(1).atStartOfDay();

        // Immediately preceding period of equal length, for period-over-
        // period comparison — no gap, no overlap with the selected range.
        long rangeDays = ChronoUnit.DAYS.between(start, end);
        LocalDateTime prevEnd = start;
        LocalDateTime prevStart = start.minusDays(rangeDays);

        BigDecimal totalRevenue = orderRepository.sumGrandTotalByStatusInRange(REVENUE_STATUS, start, end);
        long totalOrders = orderRepository.countAllInRange(start, end);
        long completedOrders = orderRepository.countByStatusInRange(REVENUE_STATUS, start, end);
        long pendingOrders = orderRepository.countByStatusInRange(OrderStatus.PENDING, start, end);
        long cancelledOrders = orderRepository.countByStatusInRange(OrderStatus.CANCELLED, start, end);
        long totalCustomers = orderRepository.countDistinctCustomersInRange(start, end);
        BigDecimal averageOrderValue = safeDivide(totalRevenue, completedOrders);

        BigDecimal prevRevenue = orderRepository.sumGrandTotalByStatusInRange(REVENUE_STATUS, prevStart, prevEnd);
        long prevOrders = orderRepository.countAllInRange(prevStart, prevEnd);
        long prevCompletedOrders = orderRepository.countByStatusInRange(REVENUE_STATUS, prevStart, prevEnd);
        long prevCustomers = orderRepository.countDistinctCustomersInRange(prevStart, prevEnd);
        BigDecimal prevAverageOrderValue = safeDivide(prevRevenue, prevCompletedOrders);

        TrendResult trendResult = buildRevenueTrend(start, end, startDate, endDate);
        List<CategoryBreakdownItem> categoryBreakdown = buildCategoryBreakdown(start, end, totalRevenue);
        List<TopProductItem> topProducts = buildTopProducts(start, end);
        List<PaymentBreakdownItem> paymentBreakdown = buildPaymentBreakdown(start, end, totalOrders);

        AdminReportResponse response = new AdminReportResponse();
        response.setPeriod(new ReportPeriod(
                startDate,
                endDate,
                startDate.format(PERIOD_LABEL_FORMAT) + " – " + endDate.format(PERIOD_LABEL_FORMAT),
                trendResult.grouping()
        ));
        response.setSummary(new ReportSummary(
                totalRevenue, totalOrders, averageOrderValue, totalCustomers,
                completedOrders, pendingOrders, cancelledOrders
        ));
        response.setComparison(new ReportComparison(
                percentChange(prevRevenue, totalRevenue),
                percentChange(BigDecimal.valueOf(prevOrders), BigDecimal.valueOf(totalOrders)),
                percentChange(BigDecimal.valueOf(prevCustomers), BigDecimal.valueOf(totalCustomers)),
                percentChange(prevAverageOrderValue, averageOrderValue)
        ));
        response.setRevenueRuleNote(REVENUE_RULE_NOTE);
        response.setRevenueTrend(trendResult.points());
        response.setRevenueByCategory(categoryBreakdown);
        response.setTopProducts(topProducts);
        response.setPaymentMethods(paymentBreakdown);
        response.setSignals(buildExecutiveSignals(categoryBreakdown, topProducts, paymentBreakdown, trendResult.points()));

        return response;
    }

    private BigDecimal safeDivide(BigDecimal amount, long count) {
        if (count == 0 || amount == null) {
            return BigDecimal.ZERO;
        }
        return amount.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
    }

    // Null means "not a meaningful percentage" (previous period had a zero
    // base) — the frontend renders that as "N/A", never as "0%" or "∞%".
    private Double percentChange(BigDecimal previous, BigDecimal current) {
        BigDecimal prev = previous == null ? BigDecimal.ZERO : previous;
        BigDecimal curr = current == null ? BigDecimal.ZERO : current;
        if (prev.compareTo(BigDecimal.ZERO) == 0) {
            return curr.compareTo(BigDecimal.ZERO) == 0 ? 0.0 : null;
        }
        return curr.subtract(prev)
                .divide(prev, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private TrendResult buildRevenueTrend(LocalDateTime start, LocalDateTime end, LocalDate startDate, LocalDate endDate) {
        List<Object[]> rows = orderRepository.dailyRevenueInRange(REVENUE_STATUS, start, end);

        Map<LocalDate, BigDecimal> revenueByDay = new HashMap<>();
        Map<LocalDate, Long> ordersByDay = new HashMap<>();
        for (Object[] row : rows) {
            LocalDate day = toLocalDate(row[0]);
            revenueByDay.put(day, (BigDecimal) row[1]);
            ordersByDay.put(day, ((Number) row[2]).longValue());
        }

        // Zero-fill every calendar day in the range so the chart's x-axis
        // stays continuous even on days with no completed orders.
        List<RevenueTrendPoint> dailyPoints = new ArrayList<>();
        for (LocalDate day = startDate; !day.isAfter(endDate); day = day.plusDays(1)) {
            dailyPoints.add(new RevenueTrendPoint(
                    day.format(DAY_LABEL_FORMAT),
                    day,
                    revenueByDay.getOrDefault(day, BigDecimal.ZERO),
                    ordersByDay.getOrDefault(day, 0L)
            ));
        }

        long spanDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (spanDays <= 31) {
            return new TrendResult("DAY", dailyPoints);
        }
        // Re-bucketing only ever iterates this small, pre-aggregated daily
        // list (at most MAX_RANGE_DAYS rows) — never the underlying orders.
        if (spanDays <= 92) {
            return new TrendResult("WEEK", regroupByWeek(dailyPoints));
        }
        return new TrendResult("MONTH", regroupByMonth(dailyPoints));
    }

    private List<RevenueTrendPoint> regroupByWeek(List<RevenueTrendPoint> dailyPoints) {
        Map<LocalDate, List<RevenueTrendPoint>> byWeekStart = new LinkedHashMap<>();
        for (RevenueTrendPoint point : dailyPoints) {
            LocalDate weekStart = point.getDate().with(DayOfWeek.MONDAY);
            byWeekStart.computeIfAbsent(weekStart, k -> new ArrayList<>()).add(point);
        }
        List<RevenueTrendPoint> result = new ArrayList<>();
        for (Map.Entry<LocalDate, List<RevenueTrendPoint>> entry : byWeekStart.entrySet()) {
            List<RevenueTrendPoint> days = entry.getValue();
            LocalDate weekStart = entry.getKey();
            LocalDate weekEnd = days.get(days.size() - 1).getDate();
            BigDecimal revenue = days.stream().map(RevenueTrendPoint::getRevenue).reduce(BigDecimal.ZERO, BigDecimal::add);
            long orders = days.stream().mapToLong(RevenueTrendPoint::getOrders).sum();
            String label = weekStart.format(DAY_LABEL_FORMAT) + "–" + weekEnd.format(DAY_LABEL_FORMAT);
            result.add(new RevenueTrendPoint(label, weekStart, revenue, orders));
        }
        return result;
    }

    private List<RevenueTrendPoint> regroupByMonth(List<RevenueTrendPoint> dailyPoints) {
        Map<LocalDate, List<RevenueTrendPoint>> byMonthStart = new LinkedHashMap<>();
        for (RevenueTrendPoint point : dailyPoints) {
            LocalDate monthStart = point.getDate().withDayOfMonth(1);
            byMonthStart.computeIfAbsent(monthStart, k -> new ArrayList<>()).add(point);
        }
        List<RevenueTrendPoint> result = new ArrayList<>();
        for (Map.Entry<LocalDate, List<RevenueTrendPoint>> entry : byMonthStart.entrySet()) {
            List<RevenueTrendPoint> days = entry.getValue();
            LocalDate monthStart = entry.getKey();
            BigDecimal revenue = days.stream().map(RevenueTrendPoint::getRevenue).reduce(BigDecimal.ZERO, BigDecimal::add);
            long orders = days.stream().mapToLong(RevenueTrendPoint::getOrders).sum();
            result.add(new RevenueTrendPoint(monthStart.format(MONTH_LABEL_FORMAT), monthStart, revenue, orders));
        }
        return result;
    }

    private List<CategoryBreakdownItem> buildCategoryBreakdown(LocalDateTime start, LocalDateTime end, BigDecimal totalRevenue) {
        List<Object[]> rows = orderItemRepository.categoryBreakdownInRange(REVENUE_STATUS, start, end);
        List<CategoryBreakdownItem> items = new ArrayList<>();
        for (Object[] row : rows) {
            Long categoryId = ((Number) row[0]).longValue();
            String categoryName = (String) row[1];
            BigDecimal revenue = (BigDecimal) row[2];
            Long unitsSold = ((Number) row[3]).longValue();
            if (revenue == null || revenue.compareTo(BigDecimal.ZERO) <= 0) {
                continue; // omit zero-revenue categories rather than list them with fake weight
            }
            items.add(new CategoryBreakdownItem(categoryId, categoryName, revenue, unitsSold, percentOf(revenue, totalRevenue)));
        }
        return items;
    }

    private List<TopProductItem> buildTopProducts(LocalDateTime start, LocalDateTime end) {
        List<Object[]> rows = orderItemRepository.topProductsInRange(REVENUE_STATUS, start, end, PageRequest.of(0, 5));
        List<TopProductItem> items = new ArrayList<>();
        int rank = 1;
        for (Object[] row : rows) {
            String productName = (String) row[1];
            String categoryName = (String) row[2];
            Long unitsSold = ((Number) row[3]).longValue();
            BigDecimal revenue = (BigDecimal) row[4];
            if (revenue == null || revenue.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }
            items.add(new TopProductItem(rank++, productName, categoryName, unitsSold, revenue));
        }
        return items;
    }

    private List<PaymentBreakdownItem> buildPaymentBreakdown(LocalDateTime start, LocalDateTime end, long totalOrders) {
        // Uses ALL non-deleted orders regardless of status — payment method
        // is a placement-time choice, not tied to order completion.
        List<Object[]> rows = orderRepository.paymentBreakdownInRange(start, end);
        List<PaymentBreakdownItem> items = new ArrayList<>();
        for (Object[] row : rows) {
            PaymentMethod method = (PaymentMethod) row[0];
            Long orderCount = ((Number) row[1]).longValue();
            BigDecimal revenue = (BigDecimal) row[2];
            if (orderCount == null || orderCount == 0) {
                continue;
            }
            Double percent = totalOrders == 0 ? 0.0 : round2(orderCount * 100.0 / totalOrders);
            items.add(new PaymentBreakdownItem(method, orderCount, revenue, percent));
        }
        return items;
    }

    private List<ExecutiveSignal> buildExecutiveSignals(
            List<CategoryBreakdownItem> categoryBreakdown,
            List<TopProductItem> topProducts,
            List<PaymentBreakdownItem> paymentBreakdown,
            List<RevenueTrendPoint> trend
    ) {
        List<ExecutiveSignal> signals = new ArrayList<>();

        if (!categoryBreakdown.isEmpty()) {
            CategoryBreakdownItem top = categoryBreakdown.get(0);
            String helper = formatMoney(top.getRevenue())
                    + (top.getRevenuePercentage() != null ? " · " + top.getRevenuePercentage() + "% of revenue" : "");
            signals.add(new ExecutiveSignal("Top Revenue Category", top.getCategoryName(), helper));
        }

        if (!topProducts.isEmpty()) {
            TopProductItem top = topProducts.get(0);
            signals.add(new ExecutiveSignal(
                    "Top Selling Product",
                    top.getProductName(),
                    top.getUnitsSold() + " units · " + formatMoney(top.getRevenue())
            ));
        }

        Optional<RevenueTrendPoint> bestDay = trend.stream()
                .filter(p -> p.getRevenue() != null && p.getRevenue().compareTo(BigDecimal.ZERO) > 0)
                .max(Comparator.comparing(RevenueTrendPoint::getRevenue));
        bestDay.ifPresent(point -> signals.add(new ExecutiveSignal(
                "Highest Order Day",
                point.getLabel(),
                formatMoney(point.getRevenue()) + " · " + point.getOrders() + " order" + (point.getOrders() == 1 ? "" : "s")
        )));

        if (!paymentBreakdown.isEmpty()) {
            PaymentBreakdownItem top = paymentBreakdown.get(0);
            signals.add(new ExecutiveSignal(
                    "Most-Used Payment Method",
                    top.getPaymentMethod().name(),
                    top.getPercentage() + "% of orders"
            ));
        }

        return signals;
    }

    private Double percentOf(BigDecimal part, BigDecimal whole) {
        if (whole == null || whole.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        return round2(part.divide(whole, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue());
    }

    private double round2(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private String formatMoney(BigDecimal amount) {
        BigDecimal safe = amount == null ? BigDecimal.ZERO : amount;
        return "৳" + safe.setScale(0, RoundingMode.HALF_UP).toPlainString();
    }

    private LocalDate toLocalDate(Object dbValue) {
        if (dbValue instanceof java.sql.Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        if (dbValue instanceof LocalDate localDate) {
            return localDate;
        }
        if (dbValue instanceof LocalDateTime localDateTime) {
            return localDateTime.toLocalDate();
        }
        throw new IllegalStateException("Unexpected date type from query: " + dbValue.getClass());
    }
}
