"use client";

import { trpc } from "@/app/_trpc/client";
import PageSpinner from "@/components/chef-console/page-spinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, FileCheck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ChefConsoleAdminPanelPage() {
  const router = useRouter();
  const getChefUser = trpc.chefUser.getChefUser.useQuery();
  const listChefUsers = trpc.admin.listChefUsers.useQuery(undefined, {
    enabled: getChefUser.data?.chefUser.isAdmin === true,
  });

  const approveChef = trpc.admin.approveChef.useMutation({
    onSuccess: () => {
      toast.success("Chef approved successfully");
      listChefUsers.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (getChefUser.isLoading) {
    return <PageSpinner />;
  }

  if (!getChefUser.data?.chefUser.isAdmin) {
    router.push("/chef-console/dashboard");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="section-title">Admin Panel</div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>ID Verified</TableHead>
              <TableHead>Stripe Setup</TableHead>
              <TableHead>1099 Status</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listChefUsers.data?.chefUsers.map((chef) => (
              <TableRow key={chef.id}>
                <TableCell>{chef.name}</TableCell>
                <TableCell>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="truncate max-w-[200px]">
                        {chef.email}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{chef.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <StatusIcon status={chef.isIdVerified} />
                </TableCell>
                <TableCell>
                  <StatusIcon status={chef.stripeOnboardingComplete} />
                </TableCell>
                <TableCell>
                  <StatusIcon
                    status={
                      chef.form1099Status === "Submitted" ||
                      chef.form1099Status === "Approved"
                    }
                  />
                </TableCell>
                <TableCell>
                  <StatusIcon status={chef.isApproved} />
                </TableCell>
                <TableCell>
                  <Button
                    label="Approve"
                    onClick={() => approveChef.mutate({ chefId: chef.id })}
                    disabled={
                      chef.isApproved ||
                      !chef.isIdVerified ||
                      !chef.stripeOnboardingComplete ||
                      chef.form1099Status !== "Submitted"
                    }
                    size="sm"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: boolean }) {
  return status ? (
    <CheckCircle2 className="w-5 h-5 text-green-500" />
  ) : (
    <XCircle className="w-5 h-5 text-red-500" />
  );
}

function Form1099Status({
  status,
}: {
  status: "NotStarted" | "Submitted" | "Approved";
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            {status === "NotStarted" && (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            {status === "Submitted" && (
              <FileCheck className="w-5 h-5 text-amber-500" />
            )}
            {status === "Approved" && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
