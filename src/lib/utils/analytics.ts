import type { Order, Product } from '$lib/types/entities';

export interface AnalyticsData {
    orders: Order[];
    products: Product[];
}

export interface MetricCard {
    label: string;
    value: string | number;
    icon: string;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

export function calculateMetrics(data: AnalyticsData) {
    const completedOrders = data.orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => {
        return sum + order.products.reduce((orderSum, item) => {
            const product = data.products.find(p => p.id === item.product_id);
            return orderSum + ((product?.price || 0) * item.quantity);
        }, 0);
    }, 0);

    const aov = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    const cancelRate = data.orders.length > 0
        ? ((data.orders.filter(o => o.status === 'canceled').length / data.orders.length) * 100).toFixed(2)
        : 0;

    return {
        totalRevenue,
        totalOrders: data.orders.length,
        completedOrders: completedOrders.length,
        aov,
        cancelRate,
    };
}

export function getTopProducts(data: AnalyticsData, limit = 5) {
    const productStats = new Map<number, { product: Product; units: number; revenue: number }>();

    data.orders.forEach(order => {
        order.products.forEach(item => {
            const product = data.products.find(p => p.id === item.product_id);
            if (!product) return;

            const current = productStats.get(product.id) || { product, units: 0, revenue: 0 };
            current.units += item.quantity;
            current.revenue += product.price * item.quantity;
            productStats.set(product.id, current);
        });
    });

    return Array.from(productStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
}

export function getRevenueByType(data: AnalyticsData) {
    const completedOrders = data.orders.filter(o => o.status === 'completed');
    const typeRevenue = new Map<string, number>();

    completedOrders.forEach(order => {
        order.products.forEach(item => {
            const product = data.products.find(p => p.id === item.product_id);
            if (!product) return;

            const revenue = product.price * item.quantity;
            typeRevenue.set(product.type, (typeRevenue.get(product.type) || 0) + revenue);
        });
    });

    return Array.from(typeRevenue.entries()).map(([type, revenue]) => ({
        type,
        revenue,
    }));
}

export function getOrderStatusBreakdown(data: AnalyticsData) {
    const breakdown = {
        pending: 0,
        shipped: 0,
        completed: 0,
        canceled: 0,
    };

    data.orders.forEach(order => {
        breakdown[order.status]++;
    });

    return breakdown;
}

export function getTopRegions(data: AnalyticsData, limit = 5) {
    const regionStats = new Map<number, number>();

    data.orders.forEach(order => {
        regionStats.set(order.wilaya, (regionStats.get(order.wilaya) || 0) + 1);
    });

    return Array.from(regionStats.entries())
        .map(([wilaya, orders]) => ({
            wilaya,
            orders,
            label: `Wilaya ${wilaya}`,
        }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, limit);
}

export function getCouponImpact(data: AnalyticsData) {
    // This would need coupon data from orders, placeholder for now
    return {
        ordersWithCoupon: 0,
        totalOrders: data.orders.length,
        avgDiscount: 0,
    };
}

export function getRevenueByMonth(data: AnalyticsData) {
    const monthlyRevenue = new Map<string, number>();
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthlyRevenue.set(monthKey, 0);
    }

    data.orders.filter(o => o.status === 'completed').forEach(order => {
        const orderDate = new Date(order.created_at);
        const monthKey = orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

        if (monthlyRevenue.has(monthKey)) {
            const revenue = order.products.reduce((sum, item) => {
                const product = data.products.find(p => p.id === item.product_id);
                return sum + ((product?.price || 0) * item.quantity);
            }, 0);

            monthlyRevenue.set(monthKey, (monthlyRevenue.get(monthKey) || 0) + revenue);
        }
    });

    return Array.from(monthlyRevenue.entries()).map(([month, revenue]) => ({
        month,
        revenue,
    }));
}
