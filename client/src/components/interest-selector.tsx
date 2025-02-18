
import { categories } from "@shared/schema";
import { Button } from "./ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";

export function InterestSelector() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (interests: string[]) => {
      const response = await fetch("/api/user/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
      });
      return response.json();
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Your Interests</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={user?.interests?.includes(category) ? "default" : "outline"}
            onClick={() => {
              const newInterests = user?.interests?.includes(category)
                ? user.interests.filter((i: string) => i !== category)
                : [...(user?.interests || []), category];
              mutation.mutate(newInterests);
            }}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
