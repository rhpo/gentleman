import type { PageServerLoad } from './$types';
import { getOrdersServer } from '$lib/api/services/ordersService';
import * as productService from '$lib/api/server/products';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    try {
        const [orders, products] = await Promise.all([
            getOrdersServer(cookies),
            productService.getProducts(locals.supabase)
        ]);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate revenue by month (last 12 months)
        const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
            const monthDate = new Date(currentYear, currentMonth - (11 - i), 1);
            const monthOrders = orders.filter((order: any) => {
                const orderDate = new Date(order.created_at);
                return orderDate.getMonth() === monthDate.getMonth() &&
                    orderDate.getFullYear() === monthDate.getFullYear() &&
                    order.status !== 'canceled';
            });

            const revenue = monthOrders.reduce((sum: number, order: any) => {
                const orderTotal = order.products.reduce((total: number, item: any) =>
                    total + (item.price * item.quantity), 0);
                return sum + orderTotal;
            }, 0);

            return {
                date: monthDate.toISOString(),
                value: revenue
            };
        });

        // Calculate orders by month (last 12 months)
        const ordersByMonth = Array.from({ length: 12 }, (_, i) => {
            const monthDate = new Date(currentYear, currentMonth - (11 - i), 1);
            const monthOrders = orders.filter((order: any) => {
                const orderDate = new Date(order.created_at);
                return orderDate.getMonth() === monthDate.getMonth() &&
                    orderDate.getFullYear() === monthDate.getFullYear();
            });

            return {
                date: monthDate.toISOString(),
                value: monthOrders.length
            };
        });

        // Calculate product sales
        const productSales: Record<string, number> = {};
        orders.forEach((order: any) => {
            if (order.status !== 'canceled') {
                order.products.forEach((item: any) => {
                    const productName = item.name || 'Unknown';
                    productSales[productName] = (productSales[productName] || 0) + item.quantity;
                });
            }
        });

        // Get top 8 products
        const topProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([name, quantity]) => ({ name, quantity }));

        // Calculate customer analytics (new vs returning - last 12 months)
        const customersByMonth = Array.from({ length: 12 }, (_, i) => {
            const monthDate = new Date(currentYear, currentMonth - (11 - i), 1);
            const monthOrders = orders.filter((order: any) => {
                const orderDate = new Date(order.created_at);
                return orderDate.getMonth() === monthDate.getMonth() &&
                    orderDate.getFullYear() === monthDate.getFullYear();
            });

            // Track unique customers by phone number
            const uniqueCustomers = new Set(monthOrders.map((o: any) => o.phone_number));

            // Simple heuristic: customers with multiple orders are "returning"
            const customerOrderCounts: Record<string, number> = {};
            orders.forEach((order: any) => {
                const orderDate = new Date(order.created_at);
                if (orderDate <= monthDate) {
                    customerOrderCounts[order.phone_number] = (customerOrderCounts[order.phone_number] || 0) + 1;
                }
            });

            let newCustomers = 0;
            let returningCustomers = 0;

            monthOrders.forEach((order: any) => {
                if (customerOrderCounts[order.phone_number] === 1) {
                    newCustomers++;
                } else {
                    returningCustomers++;
                }
            });

            return {
                date: monthDate.toISOString(),
                newCustomers,
                returningCustomers
            };
        });

        // Calculate metrics
        const totalRevenue = orders
            .filter((order: any) => order.status !== 'canceled')
            .reduce((sum: number, order: any) => {
                const orderTotal = order.products.reduce((total: number, item: any) =>
                    total + (item.price * item.quantity), 0);
                return sum + orderTotal;
            }, 0);

        const totalOrders = orders.length;
        const totalProductsSold = orders
            .filter((order: any) => order.status !== 'canceled')
            .reduce((sum: number, order: any) => {
                return sum + order.products.reduce((total: number, item: any) =>
                    total + item.quantity, 0);
            }, 0);

        const uniqueCustomers = new Set(orders.map((o: any) => o.phone_number)).size;

        // Calculate previous period for comparison
        const lastMonthOrders = orders.filter((order: any) => {
            const orderDate = new Date(order.created_at);
            return orderDate.getMonth() === (currentMonth - 1 + 12) % 12 &&
                orderDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
        });

        const twoMonthsAgoOrders = orders.filter((order: any) => {
            const orderDate = new Date(order.created_at);
            return orderDate.getMonth() === (currentMonth - 2 + 12) % 12 &&
                orderDate.getFullYear() === (currentMonth <= 1 ? currentYear - 1 : currentYear);
        });

        const lastMonthRevenue = lastMonthOrders
            .filter((order: any) => order.status !== 'canceled')
            .reduce((sum: number, order: any) => {
                const orderTotal = order.products.reduce((total: number, item: any) =>
                    total + (item.price * item.quantity), 0);
                return sum + orderTotal;
            }, 0);

        const twoMonthsAgoRevenue = twoMonthsAgoOrders
            .filter((order: any) => order.status !== 'canceled')
            .reduce((sum: number, order: any) => {
                const orderTotal = order.products.reduce((total: number, item: any) =>
                    total + (item.price * item.quantity), 0);
                return sum + orderTotal;
            }, 0);

        const revenueChange = twoMonthsAgoRevenue > 0
            ? ((lastMonthRevenue - twoMonthsAgoRevenue) / twoMonthsAgoRevenue * 100).toFixed(1)
            : '0.0';

        const ordersChange = twoMonthsAgoOrders.length > 0
            ? ((lastMonthOrders.length - twoMonthsAgoOrders.length) / twoMonthsAgoOrders.length * 100).toFixed(1)
            : '0.0';

        return {
            analytics: {
                revenueByMonth,
                ordersByMonth,
                topProducts,
                customersByMonth,
                metrics: {
                    totalRevenue: totalRevenue.toFixed(2),
                    revenueChange: `${Number(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
                    revenueTrend: Number(revenueChange) >= 0 ? 'up' : 'down',
                    totalOrders,
                    ordersChange: `${Number(ordersChange) >= 0 ? '+' : ''}${ordersChange}%`,
                    ordersTrend: Number(ordersChange) >= 0 ? 'up' : 'down',
                    totalProductsSold,
                    uniqueCustomers
                }
            }
        };
    } catch (err) {
        console.error('Error loading analytics:', err);
        return {
            analytics: null,
            error: err instanceof Error ? err.message : 'Failed to load analytics'
        };
    }
};
