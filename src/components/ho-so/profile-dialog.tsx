"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioChip, RadioGroup } from "@/components/ui/radio-group";
import { DateField, TextField } from "@/components/app/form-fields";
import { type ProfileForm, profileFormSchema } from "@/lib/forms";

export function ProfileDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  mode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProfileForm | null;
  onSubmit: (values: ProfileForm) => void;
  mode: "create" | "edit";
}) {
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initial ?? { name: "", birthDate: "", gender: null },
  });

  useEffect(() => {
    if (open) form.reset(initial ?? { name: "", birthDate: "", gender: null });
  }, [open, initial, form]);

  const errors = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm hồ sơ" : "Sửa hồ sơ"}</DialogTitle>
          <DialogDescription>Hồ sơ được lưu trên trình duyệt này để bạn không phải nhập lại ngày sinh.</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
          <TextField label="Tên hồ sơ" placeholder="Ví dụ: Bản thân, Mẹ, Anh Tuấn" maxLength={60} error={errors.name?.message} {...form.register("name")} />
          <DateField error={errors.birthDate?.message} {...form.register("birthDate")} />
          <Controller
            control={form.control}
            name="gender"
            render={({ field }) => (
              <div className="grid gap-2">
                <span id="gt-label" className="text-sm font-medium">
                  Giới tính theo quy ước cung phi (không bắt buộc)
                </span>
                <RadioGroup
                  value={field.value ?? "khong"}
                  onValueChange={(v) => field.onChange(v === "khong" ? null : v)}
                  aria-labelledby="gt-label"
                  className="grid-cols-3"
                >
                  <RadioChip value="khong">Không lưu</RadioChip>
                  <RadioChip value="nam">Nam</RadioChip>
                  <RadioChip value="nu">Nữ</RadioChip>
                </RadioGroup>
                <p className="text-[0.8125rem] text-muted-foreground">Chỉ dùng để tính cung phi và phong thủy Bát trạch.</p>
              </div>
            )}
          />
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">{mode === "create" ? "Thêm hồ sơ" : "Lưu thay đổi"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
