import { useMutation, useQueryClient } from "@tanstack/react-query";

async function approveLoan(id: string, reviewNotes?: string) {
  const response = await fetch(`/api/loans/${id}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewNotes }),
  });

  if (response.status === 404) {
    throw new Error("Loan not found");
  }

  if (!response.ok) {
    throw new Error(`Something went wrong. Status: ${response.status}`);
  }

  return response.json();
}

function useApproveLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewNotes }: { id: string; reviewNotes?: string }) =>
      approveLoan(id, reviewNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}

export default useApproveLoan;