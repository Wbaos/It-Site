import SvgIcon from "@/components/common/SvgIcons";

interface BookingStepsProps {
  currentStep: 1 | 2 | 3 | 4;
}

export default function BookingSteps({ currentStep }: BookingStepsProps) {
  const steps = [
    { number: 1, label: "Service Options" },
    { number: 2, label: "Contact Info" },
    { number: 3, label: "Address" },
    { number: 4, label: "Schedule" },
  ];

  return (
    <div className="booking-steps">
      {steps.map((step, index) => (
        <div key={step.number} className="step-wrapper">
          <div className="step-item">
            <div
              className={`step-circle ${
                step.number === currentStep
                  ? "active"
                  : step.number < currentStep
                  ? "completed"
                  : "pending"
              }`}
            >
              {step.number < currentStep ? (
                <SvgIcon name="check" size={16} />
              ) : (
                step.number
              )}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`step-line ${
                step.number < currentStep ? "completed" : "pending"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
