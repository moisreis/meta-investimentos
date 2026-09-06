"use client";
import { useState } from "react";
import Sidebar from "../components/sidebar";
import Header from '../components/header';
import SidebarTabs from "../components/sidebar-tabs";

export default function MainShell() {
    const [activeTab, setActiveTab] = useState("portfolio");

    return (
        <div className="grid grid-cols-32 min-h-screen">
            <SidebarTabs activeTab={activeTab} onActiveTabChange={setActiveTab} />
            <Sidebar activeTab={activeTab} />
            <div className="col-span-27">
                <Header />
                <main className="flex-1 p-4">
                    {/* Main content goes here */}
                </main>
            </div>
        </div>
    );
}