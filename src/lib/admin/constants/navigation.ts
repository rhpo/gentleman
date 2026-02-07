import { Box, ChartBar, LayoutDashboard, ShoppingCart, Tag } from "@lucide/svelte";


export const ADMIN_NAVIGATION = [
    {
        title: 'Dashboard',
        Icon: LayoutDashboard,
        href: '/admin/'
    },
    {
        title: 'Products',
        Icon: Box,
        href: '/admin/products'
    },
    {
        title: 'Brands',
        Icon: Tag,
        href: '/admin/brands'
    },
    {
        title: 'Orders',
        Icon: ShoppingCart,
        href: '/admin/orders'
    },
    {
        title: 'Analytics',
        Icon: ChartBar,
        href: '/admin/analytics'
    },
    {
        title: 'Coupons',
        Icon: Tag,
        href: '/admin/coupons'
    }
];
