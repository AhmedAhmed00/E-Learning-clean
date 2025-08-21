import { DriversIcon, HomeIcon, EmployeesRolesIcon, OrdersIcon, SettingsIcon, StorageIcon, VendorIcon } from "@/components/icons";

export enum PageRoutes {
    //auth
    LOGIN = "/login",
    FORGET_PASSWORD = "/forget-password",
    // dashboard
    HOME = "/",
    STORAGE = "/storage",
    VENDOR = "/vendor",
    DRIVERS = "/drivers",
    ORDERS = "/orders",
    EMPLOYEES_ROLES = "/employees-roles",
    SETTINGS = "/settings",
    NOT_FOUND = "*",
}

export const dashboardRoutes = [
    {
        name: "Dashboard",
        path: PageRoutes.HOME,
        active: "",
        icon: <HomeIcon />,
    },
    {
        name: "Storage",
        path: PageRoutes.STORAGE,
        active: "storage",
        icon: <StorageIcon />,
    },
    {
        name: "Vendor",
        path: PageRoutes.VENDOR,
        active: "vendor",
        icon: <VendorIcon />,
    },
    {
        name: "Drivers",
        path: PageRoutes.DRIVERS,
        active: "drivers",
        icon: <DriversIcon />,
    },
    {
        name: "Orders",
        path: PageRoutes.ORDERS,
        active: "orders",
        icon: <OrdersIcon />,
    },
    {
        name: "Employees Roles",
        path: PageRoutes.EMPLOYEES_ROLES,
        active: "employees-roles",
        icon: <EmployeesRolesIcon />,
    },
    {
        name: "Settings",
        path: PageRoutes.SETTINGS,
        active: "settings",
        icon: <SettingsIcon />,
    },
];

export const navBarTitlte = {
    [PageRoutes.HOME]: "Dashboard",
    [PageRoutes.STORAGE]: "Storage Management",
    [PageRoutes.VENDOR]: "Vendor Management",
    [PageRoutes.DRIVERS]: "Driver Management",
    [PageRoutes.ORDERS]: "Orders Management",
    [PageRoutes.EMPLOYEES_ROLES]: "Employees and Role Management",
    [PageRoutes.SETTINGS]: "Settings",
};