"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { 
    Code,
    ImageIcon,
    LayoutDashboard, 
    MessageSquare } from "lucide-react";

const montserrat = Montserrat({ 
    weight: "600", 
    subsets: ["latin"]
});

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Conversation",
        icon: MessageSquare,
        href: "/conversation",
        color: "text-violet-500",
    },
    {
        label: "Manifest Your Dreams with Image Generation",
        icon: ImageIcon,
        href: "/story_telling_with_images",
        color: "text-pink-700",
    },
    {
        label: "Code Generation",
        icon: Code,
        href: "/code",
        color: "text-green-700"
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111287] text-white">
            <div className="px-3 flex-1">
                <Link href="/dashboard" className="flex flex-col items-left pl-3 mb-14">
                    <div className="relative w-6 h-6 left-0">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <h1 className={cn("text-2xl font-bold mb-2 py-3 absolute top-0 pl-8", montserrat.className)}>
                        AetherNexusAI
                    </h1>
                    
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link 
                            href={route.href}
                            key={route.href}
                            className={cn("text-sm group flex p-3 w-full justify-start font-medium\
                            cursor-pointer hover:text-white hover:bg-white/10 rounded-lg\
                            transition", 
                            pathname === route.href ? "text-white bg-white/10" : 
                            "text-zinc-400")}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;