import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

// Import your regions data
// import kenya from "../../assets/regions_data.json";

// Mock data for demo - replace with your actual import
const kenya = {
  "Nairobi": [
    { Place: "Westlands" },
    { Place: "Karen" },
    { Place: "Kilimani" },
    { Place: "Lavington" }
  ],
  "Mombasa": [
    { Place: "Nyali" },
    { Place: "Bamburi" },
    { Place: "Diani" }
  ]
};

export function AddressModal({ 
  open, 
  onOpenChange, 
  onSave, 
  editAddress = null,
  mode = "shipping" // "shipping" or "billing"
}) {
  const [city, setCity] = useState(editAddress?.city || "");
  const [address, setAddress] = useState(editAddress?.address || "");
  const [postalCode, setPostalCode] = useState(editAddress?.postalCode || "");
  const [country, setCountry] = useState(editAddress?.country || "Kenya");

  const cityOptions = Object.keys(kenya);
  
  const addressOptions =
    city && kenya[city]
      ? kenya[city].map((loc, idx) => ({
          value: loc.Place,
          label: loc.Place,
          key: `${loc.Place}-${idx}`
        }))
      : [];

  const handleSubmit = () => {
    if (!address || !city || !postalCode || !country) return;
    
    onSave({ address, city, postalCode, country });
    onOpenChange(false);
    
    // Reset
    setCity("");
    setAddress("");
    setPostalCode("");
    setCountry("Kenya");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset
    setCity("");
    setAddress("");
    setPostalCode("");
    setCountry("Kenya");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-2 border-black p-0 max-w-lg">
        {/* Header */}
        <DialogHeader className="border-b-2 border-black p-6 pb-5">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm uppercase tracking-[0.3em] font-medium">
              {editAddress ? "Edit" : "Add"} {mode} Address
            </DialogTitle>
            <button
              onClick={handleClose}
              className="hover:bg-gray-100 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* City */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] font-medium">
              City
            </Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-11 border-black border-2 bg-white text-sm focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="border-2 border-black">
                {cityOptions.map((c, i) => (
                  <SelectItem 
                    key={`city-${i}`} 
                    value={c} 
                    className="text-sm py-2.5 focus:bg-black focus:text-white"
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] font-medium">
              Address
            </Label>
            <Select
              value={address}
              onValueChange={setAddress}
              disabled={!city}
            >
              <SelectTrigger 
                className={`h-11 border-black border-2 bg-white text-sm focus:ring-0 focus:ring-offset-0 ${
                  !city ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <SelectValue placeholder={city ? "Select address" : "Select city first"} />
              </SelectTrigger>
              <SelectContent className="border-2 border-black">
                {addressOptions.map((option) => (
                  <SelectItem 
                    key={option.key} 
                    value={option.value} 
                    className="text-sm py-2.5 focus:bg-black focus:text-white"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] font-medium">
              Postal Code
            </Label>
            <Input
              type="text"
              placeholder="00100"
              className="h-11 border-black border-2 bg-white text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] font-medium">
              Country
            </Label>
            <Input
              type="text"
              placeholder="Kenya"
              className="h-11 border-black border-2 bg-white text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11 border-2 border-black bg-white hover:bg-gray-50 text-[10px] uppercase tracking-[0.2em] font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-11 bg-black text-white hover:bg-gray-900 text-[10px] uppercase tracking-[0.2em] font-medium"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}