import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  AdminFranchise,
  CentralKitchenOption,
  CreateFranchisePayload,
  FranchiseStatus,
  UpdateFranchisePayload,
} from "@/types/admin/franchise.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: AdminFranchise | null;
  kitchenOptions: CentralKitchenOption[];
  onCreate: (payload: CreateFranchisePayload) => void | Promise<void>;
  onUpdate: (
    id: number,
    payload: UpdateFranchisePayload,
  ) => void | Promise<void>;
};

const STATUS_OPTIONS: FranchiseStatus[] = ["ACTIVE", "INACTIVE"];

const buildOsmEmbed = (lat: number, lng: number) => {
  const d = 0.01;
  const left = lng - d;
  const right = lng + d;
  const top = lat + d;
  const bottom = lat - d;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
};

const buildGoogleLink = (lat: number, lng: number) =>
  `https://www.google.com/maps?q=${lat},${lng}`;

export const FranchiseUpsertModal: React.FC<Props> = ({
  open,
  onOpenChange,
  selected,
  kitchenOptions,
  onCreate,
  onUpdate,
}) => {
  const isEdit = !!selected;

  const [centralKitchenId, setCentralKitchenId] = useState<number>(0);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<FranchiseStatus>("ACTIVE");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  useEffect(() => {
    if (!open) return;

    if (selected) {
      setCentralKitchenId(selected.centralKitchenId);
      setName(selected.name);
      setStatus(selected.status);
      setAddress(selected.address);
      setLocation(selected.location);
      setLatitude(selected.latitude);
      setLongitude(selected.longitude);
      return;
    }

    setCentralKitchenId(kitchenOptions[0]?.value ?? 0);
    setName("");
    setStatus("ACTIVE");
    setAddress("");
    setLocation("");
    setLatitude(0);
    setLongitude(0);
  }, [open, selected, kitchenOptions]);

  useEffect(() => {
    if (!open || selected) return;

    if (
      centralKitchenId === 0 &&
      kitchenOptions.length > 0
    ) {
      setCentralKitchenId(kitchenOptions[0].value);
    }
  }, [open, selected, kitchenOptions, centralKitchenId]);

  const canSubmit = useMemo(() => {
    return (
      centralKitchenId > 0 &&
      name.trim().length > 0 &&
      address.trim().length > 0 &&
      location.trim().length > 0 &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude !== 0 &&
      longitude !== 0
    );
  }, [centralKitchenId, name, address, location, latitude, longitude]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload: CreateFranchisePayload | UpdateFranchisePayload = {
      centralKitchenId,
      name: name.trim(),
      type: "STORE",
      status,
      address: address.trim(),
      location: location.trim(),
      latitude,
      longitude,
    };

    if (selected) {
      await onUpdate(selected.franchiseId, payload);
      return;
    }

    await onCreate(payload);
  };

  const noKitchenOptions = kitchenOptions.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa Cửa hàng" : "Thêm Cửa hàng"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Bếp trung tâm</Label>
            <Select
              value={centralKitchenId > 0 ? String(centralKitchenId) : undefined}
              onValueChange={(v) => setCentralKitchenId(Number(v))}
              disabled={noKitchenOptions}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn bếp trung tâm" />
              </SelectTrigger>
              <SelectContent>
                {kitchenOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {noKitchenOptions && (
              <p className="mt-1 text-xs text-destructive">
                Chưa có dữ liệu bếp trung tâm để gán cho cửa hàng.
              </p>
            )}
          </div>

          <div>
            <Label>Loại</Label>
            <Input value="STORE" disabled />
          </div>

          <div>
            <Label>Tên cửa hàng</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Franchise Store - District 1"
            />
          </div>

          <div>
            <Label>Trạng thái</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as FranchiseStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Địa chỉ</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Nguyễn Huệ, Q1, TP.HCM"
            />
          </div>

          <div>
            <Label>Khu vực</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="TP.HCM"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Vĩ độ (latitude)</Label>
              <Input
                type="number"
                value={latitude}
                onChange={(e) =>
                  setLatitude(
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
              />
            </div>

            <div>
              <Label>Kinh độ (longitude)</Label>
              <Input
                type="number"
                value={longitude}
                onChange={(e) =>
                  setLongitude(
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>

          {latitude !== 0 && longitude !== 0 ? (
            <div className="border rounded-xl overflow-hidden bg-muted/20">
              <iframe
                title="map"
                src={buildOsmEmbed(latitude, longitude)}
                className="w-full h-[280px]"
              />
              <div className="p-2 flex justify-end border-t bg-background">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    window.open(buildGoogleLink(latitude, longitude), "_blank")
                  }
                >
                  Mở Google Maps
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Nhập latitude/longitude để xem vị trí trên bản đồ.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!canSubmit || noKitchenOptions}
            >
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};