import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {/* Total Solved */}
      <Card className="flex flex-col justify-between p-6 shadow-md">
        <CardHeader>
          <CardDescription>📊 Total Problems Solved</CardDescription>
          <CardTitle className="text-3xl font-bold">125</CardTitle>
          <CardAction>
            <Badge variant="outline" className="mt-2">
              <IconTrendingUp className="size-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground mt-4">
          <span className="font-medium text-black flex items-center gap-1">
            Trending up <IconTrendingUp className="size-4" />
          </span>
          <span>This month</span>
        </CardFooter>
      </Card>

      {/* Solved Today */}
      <Card className="flex flex-col justify-between p-6 shadow-md">
        <CardHeader>
          <CardDescription>📅 Solved Today</CardDescription>
          <CardTitle className="text-3xl font-bold">4</CardTitle>
          <CardAction>
            <Badge variant="outline" className="mt-2">
              <IconTrendingUp className="size-4" />
              +1
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground mt-4">
          <span className="font-medium text-black flex items-center gap-1">
            Great consistency <IconTrendingUp className="size-4" />
          </span>
          <span>Keep it up!</span>
        </CardFooter>
      </Card>

      {/* This Week */}
      <Card className="flex flex-col justify-between p-6 shadow-md">
        <CardHeader>
          <CardDescription>🗓️ This Week</CardDescription>
          <CardTitle className="text-3xl font-bold">12</CardTitle>
          <CardAction>
            <Badge variant="outline" className="mt-2">
              <IconTrendingDown className="size-4" />
              -2
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground mt-4">
          <span className="font-medium text-black flex items-center gap-1">
            Slight dip <IconTrendingDown className="size-4" />
          </span>
          <span>Stay on track</span>
        </CardFooter>
      </Card>

      {/* All Time */}
      <Card className="flex flex-col justify-between p-6 shadow-md">
        <CardHeader>
          <CardDescription>📈 All Time</CardDescription>
          <CardTitle className="text-3xl font-bold">345</CardTitle>
          <CardAction>
            <Badge variant="outline" className="mt-2">
              <IconTrendingUp className="size-4" />
              +5.6%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground mt-4">
          <span className="font-medium text-black flex items-center gap-1">
            Awesome progress <IconTrendingUp className="size-4" />
          </span>
          <span>You’re crushing it 🚀</span>
        </CardFooter>
      </Card>
    </div>
  );
}
