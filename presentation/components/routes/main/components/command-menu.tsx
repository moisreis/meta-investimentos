"use client"

import { useEffect } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandList,
} from "@/presentation/components/ui/command";

type CommandMenuProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open, onOpenChange]);

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
        </CommandDialog>
    );
}
