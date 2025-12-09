import React from "react";
import { useNavigate } from "react-router-dom";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, MapPin, CreditCard, Receipt } from "lucide-react";

function CheckoutSteps({ step_active, completed = {} }) {
  const navigate = useNavigate();
  const activeStep = parseInt(step_active, 10);

  const steps = [
    { label: "CUSTOMER ADDRESS", icon: <MapPin className="w-5 h-5" />, path: "/shipping" },
    { label: "PAYMENT METHOD", icon: <CreditCard className="w-5 h-5" />, path: "/payment" },
    { label: "CONFIRM ORDER", icon: <Receipt className="w-5 h-5" />, path: "/placeorder" },
  ];

  const goTo = (index) => {
    navigate(steps[index].path);
  };

  return (
    <div className="w-full flex justify-center py-4 bg-white text-black">
      <Tabs value={String(activeStep)} className="w-full max-w-3xl">
        <TabsList className="w-full flex justify-between bg-white shadow-sm border border-gray-200 rounded-xl px-2 py-3">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = completed[index] || false;

            return (
              <TabsTrigger
                key={index}
                value={String(index)}
                onClick={() => goTo(index)}
                className={`
                  flex items-center gap-2 text-sm font-medium w-full justify-center py-3 rounded-lg transition
                  ${isActive ? "bg-black text-white shadow-sm" : "bg-white text-black border border-transparent hover:bg-gray-100"}
                `}
              >
                {/* Completed icon */}
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  step.icon
                )}

                <span>{step.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}

export default CheckoutSteps;