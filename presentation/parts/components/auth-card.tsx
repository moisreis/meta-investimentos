import { cn } from "cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/ui/card";
import { Separator } from "@/presentation/ui/separator";
import { AuthSecondaryLink } from "./auth-secondary-link";

interface AuthCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, className }: AuthCardProps) {
  return (
    <Card className={cn("relative z-10", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center">
        <AuthSecondaryLink />
      </CardFooter>
    </Card>
  );
}