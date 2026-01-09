import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, MapPin, CreditCard, Receipt, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

function CheckoutSteps({ step_active = 0, completed = {} }) {
  const [activeStep, setActiveStep] = useState(parseInt(step_active, 10));
  const location = useLocation();

  const steps = [
    { label: "Customer Address", shortLabel: "Address", icon: MapPin, path: "/shipping" },
    { label: "Payment Method", shortLabel: "Payment", icon: CreditCard, path: "/payment" },
    { label: "Confirm Order", shortLabel: "Confirm", icon: Receipt, path: "/placeorder" },
  ];

  useEffect(() => {
    const newStep = parseInt(step_active, 10);
    if (!isNaN(newStep) && newStep !== activeStep) {
      setActiveStep(newStep);
    }
  }, [step_active, activeStep]);

  useEffect(() => {
    const stepIndex = steps.findIndex(step => location.pathname === step.path);
    if (stepIndex !== -1 && stepIndex !== activeStep) {
      setActiveStep(stepIndex);
    }
  }, [location.pathname, activeStep]);

  const goTo = (index) => {
    // Only allow navigation to current step or completed steps
    if (index <= activeStep || completed[index]) {
      setActiveStep(index);
      console.log(`Navigating to: ${steps[index].path}`);
    }
  };

  const canNavigate = (index) => {
    return index <= activeStep || completed[index];
  };

  return (
    <div className="w-full flex justify-center py-4 sm:py-6 bg-white">
      <div className="w-full max-w-5xl px-3 sm:px-6">
        {/* Desktop & Tablet View */}
        <div className="hidden sm:block">
          <Tabs value={String(activeStep)} className="w-full">
            <TabsList className="w-full flex justify-between bg-white shadow-lg border border-gray-200 rounded-2xl p-2 gap-2">
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                const isComplete = completed[index] || false;
                const Icon = step.icon;
                const isClickable = canNavigate(index);

                return (
                  <TabsTrigger
                    key={index}
                    value={String(index)}
                    onClick={() => goTo(index)}
                    disabled={!isClickable}
                    className={`
                      flex items-center gap-3 text-sm lg:text-base font-semibold w-full justify-center 
                      py-4 lg:py-5 rounded-xl transition-all duration-300 ease-out
                      ${isActive 
                        ? "bg-black text-white shadow-xl scale-105" 
                        : isComplete
                        ? "bg-white text-black border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                        : "bg-white text-gray-400 border border-gray-200"
                      }
                      ${isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                    `}
                  >
                    {isComplete && !isActive ? (
                      <CheckCircle2 className="w-6 h-6 lg:w-7 lg:h-7 text-green-600 animate-in zoom-in duration-300" />
                    ) : (
                      <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${isActive ? "text-white" : isComplete ? "text-black" : "text-gray-400"}`} />
                    )}
                    <span className="hidden md:inline">{step.label}</span>
                    <span className="md:hidden">{step.shortLabel}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile View - Vertical Progress */}
        <div className="sm:hidden">
          <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-4 space-y-1">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isComplete = completed[index] || false;
              const Icon = step.icon;
              const isClickable = canNavigate(index);
              const isLast = index === steps.length - 1;

              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => goTo(index)}
                    disabled={!isClickable}
                    className={`
                      sm:hidden w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                      ${isActive 
                        ? "bg-black text-white shadow-lg scale-[1.02]" 
                        : isComplete
                        ? "bg-white text-black hover:bg-gray-50"
                        : "bg-white text-gray-400"
                      }
                      ${isClickable ? "cursor-pointer active:scale-95" : "cursor-not-allowed opacity-50"}
                    `}
                  >
                    {/* Icon/Check */}
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                      ${isActive 
                        ? "bg-white/20" 
                        : isComplete
                        ? "bg-green-50"
                        : "bg-gray-100"
                      }
                    `}>
                      {isComplete && !isActive ? (
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                      ) : (
                        <Icon className={`w-7 h-7 ${isActive ? "text-white" : isComplete ? "text-black" : "text-gray-400"}`} />
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1 text-left">
                      <div className={`text-xs uppercase tracking-wider mb-1 ${isActive ? "text-white/70" : "text-gray-500"}`}>
                        Step {index + 1}
                      </div>
                      <div className={`font-semibold text-base ${isActive ? "text-white" : isComplete ? "text-black" : "text-gray-400"}`}>
                        {step.label}
                      </div>
                    </div>

                    {/* Arrow */}
                    {isClickable && (
                      <ChevronRight className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-400"}`} />
                    )}
                  </button>

                  {/* Connector Line */}
                  {!isLast && (
                    <div className="flex justify-center py-1">
                      <div className={`
                        w-0.5 h-6 transition-all duration-300
                        ${isComplete ? "bg-green-600" : "bg-gray-200"}
                      `} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {steps.map((_, index) => {
            const isActive = index === activeStep;
            const isComplete = completed[index] || false;
            
            return (
              <div
                key={index}
                className={`
                  h-2 rounded-full transition-all duration-500 ease-out
                  ${isActive 
                    ? "w-12 bg-black" 
                    : isComplete
                    ? "w-8 bg-green-600"
                    : "w-8 bg-gray-200"
                  }
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CheckoutSteps;