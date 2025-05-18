import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
// import { chefApi } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const contractFormSchema = z.object({
  fullName: z.string().min(2, { message: "Please enter your full legal name" }),
});
type ContractFormValues = z.infer<typeof contractFormSchema>;

export default function SignContractModal({
  open,
  onOpenChange,
  chefLegalName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chefLegalName: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      fullName: chefLegalName,
    },
  });

  async function onSubmit(data: ContractFormValues) {
    try {
      setIsSubmitting(true);

      // Check if the entered name matches the chef's legal name
      if (chefLegalName && data.fullName.trim() !== chefLegalName.trim()) {
        toast.error(
          "The name you entered doesn't match your stored legal name. Please use your legal name exactly as it appears on official documents."
        );
        return;
      }

      // Call the API to sign the contract
      //   await chefApi.sign1099Contract(data.fullName);

      toast.success("Contract signed successfully!");
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error("Failed to sign contract. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={isMobile ? "w-[95vw] max-w-md p-4" : "max-w-3xl"}
      >
        <DialogHeader>
          <DialogTitle>1099 Contract Form</DialogTitle>
          <DialogDescription>
            Please review the contract carefully before signing.
            <br />
            <span className="font-medium">
              Stored legal name: {chefLegalName}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Contract PDF */}
        <div className="border rounded-lg p-2 bg-gray-50 my-2">
          <iframe
            src="/1099.pdf"
            className="w-full h-[350px] border-0"
            title="1099 Contract"
          />
        </div>

        {/* Field */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fullName">Full Legal Name:</FormLabel>
                  <FormControl>
                    <Input
                      id="fullName"
                      placeholder="Enter your full legal name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className={isMobile ? "flex-col gap-2" : "space-x-2"}>
              <Button
                variant="outline"
                type="button"
                label="Cancel"
                onClick={() => onOpenChange(false)}
                className={isMobile ? "w-full" : ""}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className={isMobile ? "w-full" : ""}
                label={isSubmitting ? "Signing..." : "Sign Contract"}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
